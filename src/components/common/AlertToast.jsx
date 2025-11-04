import { useEffect } from 'react';
import useAlertStore from '../../store/alertStore';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

export default function AlertToast() {
  const { alerts, removeAlert } = useAlertStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'error': return <XCircleIcon className="h-6 w-6 text-red-600" />;
      case 'warning': return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />;
      default: return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-500';
      case 'error': return 'bg-red-50 border-red-500';
      case 'warning': return 'bg-yellow-50 border-yellow-500';
      default: return 'bg-blue-50 border-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg ${getStyles(alert.type)} animate-slide-in`}
        >
          {getIcon(alert.type)}
          <p className="text-gray-800">{alert.message}</p>
          <button
            onClick={() => removeAlert(alert.id)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
