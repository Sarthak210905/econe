import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import useAuthStore from '../../store/authStore';
import useAlertStore from '../../store/alertStore';
import { 
  BellIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showAlert } = useAlertStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      showAlert('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showAlert('Logout failed: ' + error.message, 'error');
    }
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">EcoNE</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg">
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
