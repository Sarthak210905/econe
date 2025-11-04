import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { plantationAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import Layout from '../components/layout/Layout';
import { MapPinIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function AddPlantation() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [position, setPosition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    setValue('latitude', latlng.lat);
    setValue('longitude', latlng.lng);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
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
          showAlert('Unable to get location: ' + error.message, 'error');
        }
      );
    } else {
      showAlert('Geolocation is not supported by your browser', 'error');
    }
  };

  const onSubmit = async (data) => {
    if (!position) {
      showAlert('Please select a location on the map', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user.uid);
      formData.append('ward_id', data.ward_id);
      formData.append('latitude', position.lat);
      formData.append('longitude', position.lng);
      formData.append('planted_at', data.planted_at);
      
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await plantationAPI.add(formData);
      
      if (response.data.success) {
        showAlert(`Plantation added successfully! ID: ${response.data.plant_id}`, 'success');
        
        // Auto-verify if photo was uploaded
        if (photo && response.data.photo_url) {
          await plantationAPI.verify(response.data.plant_id, true);
        }
        
        navigate('/plantations');
      }
    } catch (error) {
      showAlert('Failed to add plantation: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Plantation</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ward ID */}
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

          {/* Planting Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Planting Date</label>
            <input
              type="date"
              {...register('planted_at', { required: 'Date is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            {errors.planted_at && (
              <p className="text-red-500 text-sm mt-1">{errors.planted_at.message}</p>
            )}
          </div>

          {/* Location Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Select Location</label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MapPinIcon className="h-5 w-5" />
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

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Plantation Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <PhotoIcon className="h-5 w-5" />
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Adding Plantation...'
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Add Plantation
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
