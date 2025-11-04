import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { db, auth, storage } from './config/firebase.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, ward_id, role } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      phone,
      ward_id,
      role: role || 'citizen',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verify user exists
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    res.json({
      success: true,
      user: {
        uid: userRecord.uid,
        ...userDoc.data()
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Plantations endpoints
app.post('/api/plantations', upload.single('photo'), async (req, res) => {
  try {
    const { user_id, ward_id, latitude, longitude, planted_at } = req.body;
    
    const plantationData = {
      user_id,
      ward_id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      planted_at,
      verified: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    // Upload photo to Firebase Storage if provided
    if (req.file) {
      const filename = `plantations/${Date.now()}_${req.file.originalname}`;
      const file = storage.file(filename);
      
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500'
      });
      
      plantationData.photo_url = url;
    }

    const docRef = await db.collection('plantations').add(plantationData);
    
    res.json({ 
      success: true, 
      plant_id: docRef.id,
      photo_url: plantationData.photo_url 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plantations', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let query = db.collection('plantations');
    if (user_id) {
      query = query.where('user_id', '==', user_id);
    }
    
    const snapshot = await query.get();
    const plantations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(plantations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plantations/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    
    await db.collection('plantations').doc(id).update({
      verified,
      verified_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grievances endpoints
app.post('/api/grievances', upload.single('image'), async (req, res) => {
  try {
    const { user_id, ward_id, category, description, latitude, longitude } = req.body;
    
    const grievanceData = {
      user_id,
      ward_id,
      category,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status: 'pending',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    if (req.file) {
      const filename = `grievances/${Date.now()}_${req.file.originalname}`;
      const file = storage.file(filename);
      
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      });
      
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500'
      });
      
      grievanceData.image_url = url;
    }

    const docRef = await db.collection('grievances').add(grievanceData);
    
    res.json({ success: true, complaint_id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/grievances', async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    let query = db.collection('grievances');
    if (user_id) {
      query = query.where('user_id', '==', user_id);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('created_at', 'desc').get();
    const grievances = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/grievances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection('grievances').doc(id).update({
      ...updates,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pollution data endpoints
app.post('/api/pollution', async (req, res) => {
  try {
    const { ward_id, aqi, pm25, pm10, co2, recorded_at } = req.body;
    
    await db.collection('pollution').add({
      ward_id,
      aqi: parseFloat(aqi),
      pm25: parseFloat(pm25),
      pm10: parseFloat(pm10),
      co2: parseFloat(co2),
      recorded_at,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pollution', async (req, res) => {
  try {
    const { ward_id } = req.query;
    
    let query = db.collection('pollution');
    if (ward_id) {
      query = query.where('ward_id', '==', ward_id);
    }
    
    const snapshot = await query.orderBy('recorded_at', 'desc').limit(100).get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revenue endpoints
app.get('/api/revenue', async (req, res) => {
  try {
    const snapshot = await db.collection('revenue').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
