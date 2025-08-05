import { createPortal } from 'react-dom';
import Notification from './Notification';

const NotificationContainer = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div key={notification.id} style={{ zIndex: 50 + index }}>
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => onRemove(notification.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;