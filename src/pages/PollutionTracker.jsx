import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import Layout from '../components/layout/Layout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PollutionTracker() {
  const [pollutionData, setPollutionData] = useState([]);
  const [selectedWard, setSelectedWard] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pollutionQuery = query(
      collection(db, 'pollution'),
      where('ward_id', '==', selectedWard),
      orderBy('recorded_at', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(pollutionQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse();
      setPollutionData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedWard]);

  const chartData = {
    labels: pollutionData.map(d => new Date(d.recorded_at).toLocaleDateString()),
    datasets: [
      {
        label: 'AQI',
        data: pollutionData.map(d => d.aqi),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'PM2.5',
        data: pollutionData.map(d => d.pm25),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      }
    ]
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'text-green-600' };
    if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-600' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'text-orange-600' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'text-red-600' };
    return { level: 'Very Unhealthy', color: 'text-purple-600' };
  };

  const latestData = pollutionData[pollutionData.length - 1] || {};
  const aqiInfo = getAQILevel(latestData.aqi || 0);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pollution Tracker</h1>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {[1, 2, 3, 4, 5].map(ward => (
              <option key={ward} value={ward}>Ward {ward}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 text-sm">AQI Level</p>
                <p className={`text-3xl font-bold ${aqiInfo.color}`}>
                  {latestData.aqi || 'N/A'}
                </p>
                <p className="text-sm mt-1">{aqiInfo.level}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 text-sm">PM2.5</p>
                <p className="text-3xl font-bold text-red-600">{latestData.pm25 || 'N/A'}</p>
                <p className="text-sm mt-1">μg/m³</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 text-sm">PM10</p>
                <p className="text-3xl font-bold text-orange-600">{latestData.pm10 || 'N/A'}</p>
                <p className="text-sm mt-1">μg/m³</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 text-sm">CO2</p>
                <p className="text-3xl font-bold text-blue-600">{latestData.co2 || 'N/A'}</p>
                <p className="text-sm mt-1">ppm</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">30-Day Trend</h2>
              <Line data={chartData} options={{ responsive: true }} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
