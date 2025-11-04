import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/authStore';
import useAlertStore from '../store/alertStore';
import Layout from '../components/layout/Layout';
import { SunIcon, BoltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function SolarFeasibility() {
  const { user } = useAuthStore();
  const { showAlert } = useAlertStore();
  const [formData, setFormData] = useState({
    roofArea: '',
    location: '',
    monthlyBill: '',
    roofType: 'flat'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateFeasibility = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculation logic
    const solarPanelEfficiency = 0.18;
    const sunlightHours = 5;
    const systemCapacity = (formData.roofArea * solarPanelEfficiency * sunlightHours) / 1000;
    const annualGeneration = systemCapacity * 365 * sunlightHours;
    const installationCost = systemCapacity * 60000;
    const annualSavings = (annualGeneration * 8);
    const paybackPeriod = (installationCost / annualSavings).toFixed(1);

    const calculationResult = {
      systemCapacity: systemCapacity.toFixed(2),
      annualGeneration: annualGeneration.toFixed(0),
      installationCost: Math.round(installationCost),
      annualSavings: Math.round(annualSavings),
      paybackPeriod,
      feasible: paybackPeriod < 10
    };

    setResult(calculationResult);

    // Save to Firestore
    try {
      await addDoc(collection(db, 'solar_assessments'), {
        user_id: user.uid,
        ...formData,
        ...calculationResult,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Solar Feasibility Calculator</h1>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <form onSubmit={calculateFeasibility} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Roof Area (sq. ft)</label>
                <input
                  type="number"
                  name="roofArea"
                  value={formData.roofArea}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Electricity Bill (₹)</label>
                <input
                  type="number"
                  name="monthlyBill"
                  value={formData.monthlyBill}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Roof Type</label>
                <select
                  name="roofType"
                  value={formData.roofType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="flat">Flat</option>
                  <option value="sloped">Sloped</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <SunIcon className="h-5 w-5" />
              {loading ? 'Calculating...' : 'Calculate Feasibility'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Assessment Results</h2>
            
            <div className={`mb-6 p-4 rounded-lg ${result.feasible ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <p className={`text-lg font-semibold ${result.feasible ? 'text-green-700' : 'text-yellow-700'}`}>
                {result.feasible ? '✓ Solar Installation is Feasible!' : '⚠ Marginal Feasibility'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <BoltIcon className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">System Capacity</p>
                <p className="text-2xl font-bold">{result.systemCapacity} kW</p>
              </div>

              <div className="text-center">
                <SunIcon className="h-10 w-10 text-orange-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Annual Generation</p>
                <p className="text-2xl font-bold">{result.annualGeneration} kWh</p>
              </div>

              <div className="text-center">
                <CurrencyDollarIcon className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Installation Cost</p>
                <p className="text-2xl font-bold">₹{result.installationCost.toLocaleString()}</p>
              </div>

              <div className="text-center">
                <CurrencyDollarIcon className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Payback Period</p>
                <p className="text-2xl font-bold">{result.paybackPeriod} years</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-3">Estimated Savings</h3>
              <p className="text-gray-700">
                Annual Savings: <span className="font-bold text-green-600">₹{result.annualSavings.toLocaleString()}</span>
              </p>
              <p className="text-gray-700 mt-2">
                25-Year Savings: <span className="font-bold text-green-600">₹{(result.annualSavings * 25).toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
