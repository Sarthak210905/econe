import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/authStore';
import Layout from '../components/layout/Layout';
import { 
  TrophyIcon, 
  SparklesIcon, 
  GiftIcon 
} from '@heroicons/react/24/outline';

export default function GreenCredits() {
  const { user } = useAuthStore();
  const [credits, setCredits] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Calculate credits from plantations
    const plantationsQuery = query(
      collection(db, 'plantations'),
      where('user_id', '==', user.uid),
      where('verified', '==', true)
    );

    const unsubscribe = onSnapshot(plantationsQuery, (snapshot) => {
      const totalCredits = snapshot.size * 10; // 10 credits per verified plantation
      setCredits(totalCredits);
      
      const activityData = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'plantation',
        credits: 10,
        ...doc.data()
      }));
      setActivities(activityData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const rewards = [
    { name: 'Tree Sapling', credits: 50, icon: '🌱' },
    { name: 'Eco Bag', credits: 100, icon: '🛍️' },
    { name: 'Water Bottle', credits: 150, icon: '💧' },
    { name: 'Solar Lamp', credits: 300, icon: '💡' },
    { name: 'Bicycle Voucher', credits: 500, icon: '🚲' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Green Credits</h1>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Your Total Credits</p>
              <p className="text-5xl font-bold mt-2">{credits}</p>
              <p className="mt-4 opacity-90">Keep planting to earn more!</p>
            </div>
            <SparklesIcon className="h-24 w-24 opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
              Recent Activities
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-semibold">Tree Plantation</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.created_at?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-green-600 font-bold">+{activity.credits}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No activities yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <GiftIcon className="h-6 w-6 text-purple-600" />
              Redeem Rewards
            </h2>
            
            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    credits >= reward.credits
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{reward.icon}</span>
                    <div>
                      <p className="font-semibold">{reward.name}</p>
                      <p className="text-sm text-gray-600">{reward.credits} credits</p>
                    </div>
                  </div>
                  <button
                    disabled={credits < reward.credits}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
