import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import Layout from '../components/layout/Layout';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Garbage Disposal',
    'Water Pollution',
    'Air Quality',
    'Noise Pollution',
    'Illegal Dumping',
    'Tree Cutting',
    'Road Maintenance',
    'Street Light',
    'Other'
  ];

  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    setValue('latitude', latlng.lat);
    setValue('longitude', latlng.lng);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handlePositionChange(latlng);
          showAlert('Location detected successfully', 'success');
        },
        (error) => {
          showAlert('Unable to get location', 'error');
        }
      );
    }
  };

  const onSubmit = async (data) => {
    if (!position) {
      showAlert('Please select a location on the map', 'error');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image to Firebase Storage
      if (image) {
        const imageRef = ref(storage, `grievances/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add complaint to Firestore
      const complaintData = {
        user_id: user.uid,
        ward_id: data.ward_id,
        category: data.category,
        description: data.description,
        latitude: position.lat,
        longitude: position.lng,
        image_url: imageUrl,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'grievances'), complaintData);
      
      showAlert(`Complaint registered successfully! ID: ${docRef.id}`, 'success');
      navigate('/grievances');
    } catch (error) {
      showAlert('Failed to register complaint: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Register Complaint</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ward ID</label>
              <input
                type="number"
                {...register('ward_id', { required: 'Ward ID is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {errors.ward_id && (
                <p className="text-red-500 text-sm mt-1">{errors.ward_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Describe the issue in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Location</label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Use My Location
              </button>
            </div>
            
            <div className="h-96 rounded-lg overflow-hidden border">
              <MapContainer
                center={[21.2514, 81.6296]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker position={position} setPosition={handlePositionChange} />
              </MapContainer>
            </div>
            
            {position && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 h-40 w-40 object-cover rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
