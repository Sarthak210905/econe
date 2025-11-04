import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  MapIcon,
  ExclamationTriangleIcon,
  SunIcon,
  CloudIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { path: '/plantations', icon: MapIcon, label: 'Plantations' },
    { path: '/grievances', icon: ExclamationTriangleIcon, label: 'Grievances' },
    { path: '/pollution', icon: CloudIcon, label: 'Pollution' },
    { path: '/solar', icon: SunIcon, label: 'Solar' },
    { path: '/green-credits', icon: SparklesIcon, label: 'Green Credits' },
    { path: '/profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <aside className="w-64 bg-white shadow-md border-r min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
