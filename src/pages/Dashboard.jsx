import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/authStore';
import Layout from '../components/layout/Layout';
import { 
  ChartBarIcon, 
  MapIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    plantations: 0,
    grievances: 0,
    greenCredits: 0,
    pollutionAqi: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Real-time listener for plantations
    const plantationsQuery = query(
      collection(db, 'plantations'),
      where('user_id', '==', user.uid)
    );
    const unsubPlantations = onSnapshot(plantationsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, plantations: snapshot.size }));
    });

    // Real-time listener for grievances
    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('user_id', '==', user.uid)
    );
    const unsubGrievances = onSnapshot(grievancesQuery, (snapshot) => {
      setStats(prev => ({ ...prev, grievances: snapshot.size }));
    });

    // Real-time listener for recent activity
    const activityQuery = query(
      collection(db, 'plantations'),
      where('user_id', '==', user.uid),
      orderBy('created_at', 'desc'),
      limit(5)
    );
    const unsubActivity = onSnapshot(activityQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentActivity(activities);
      setLoading(false);
    });

    // Get green credits from user document
    setStats(prev => ({ ...prev, greenCredits: user.green_credits || 0 }));

    // Cleanup listeners on unmount
    return () => {
      unsubPlantations();
      unsubGrievances();
      unsubActivity();
    };
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-12 w-12 ${color}`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={MapIcon}
            title="Total Plantations"
            value={stats.plantations}
            color="text-green-600"
          />
          <StatCard
            icon={ExclamationTriangleIcon}
            title="Grievances Filed"
            value={stats.grievances}
            color="text-orange-600"
          />
          <StatCard
            icon={CurrencyDollarIcon}
            title="Green Credits"
            value={stats.greenCredits}
            color="text-blue-600"
          />
          <StatCard
            icon={ChartBarIcon}
            title="AQI Level"
            value={stats.pollutionAqi || 'N/A'}
            color="text-purple-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">Plantation Added</p>
                    <p className="text-sm text-gray-600">
                      Ward {activity.ward_id} • {activity.planted_at}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    activity.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
