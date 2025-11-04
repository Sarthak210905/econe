import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import Layout from '../components/layout/Layout';
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Plantations() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [plantations, setPlantations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let plantationsQuery = query(
      collection(db, 'plantations'),
      where('user_id', '==', user.uid)
    );

    const unsubscribe = onSnapshot(plantationsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlantations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plantation?')) {
      try {
        await deleteDoc(doc(db, 'plantations', id));
        showAlert('Plantation deleted successfully', 'success');
      } catch (error) {
        showAlert('Failed to delete: ' + error.message, 'error');
      }
    }
  };

  const filteredPlantations = plantations.filter(p => {
    if (filter === 'verified') return p.verified;
    if (filter === 'pending') return !p.verified;
    return true;
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Plantations</h1>
          <button
            onClick={() => navigate('/plantations/add')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Plantation
          </button>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            All ({plantations.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Verified ({plantations.filter(p => p.verified).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Pending ({plantations.filter(p => !p.verified).length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlantations.map((plantation) => (
              <div key={plantation.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {plantation.photo_url && (
                  <img
                    src={plantation.photo_url}
                    alt="Plantation"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">Ward {plantation.ward_id}</p>
                      <p className="text-sm text-gray-600">{plantation.planted_at}</p>
                    </div>
                    {plantation.verified ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {plantation.latitude.toFixed(6)}, {plantation.longitude.toFixed(6)}
                  </p>
                  <button
                    onClick={() => handleDelete(plantation.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPlantations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No plantations found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
