const NotificationsPanel = ({ notifications, onMarkRead }) => {
  const handleMarkRead = async (id) => {
    try {
      await onMarkRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <section className="panel notifications-panel" id="notifications">
      <div className="panel-header">
        <div>
          <span className="notification-text">Alerts</span>
          <h2 className="notifications-subtext">Notifications</h2>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="empty-state">
            No alerts right now. Your budgets and recurring plans look calm.
          </p>
        ) : (
          notifications.map((notification) => (
            <article
              className={`notification-card ${notification.level} ${
                notification.read ? "read" : "unread"
              }`}
              key={notification._id}
            >
              <div className="notification-content">
                <strong>{notification.title}</strong>

                <p>{notification.message}</p>

                <small>
                  {notification.read ? "Already read" : "New notification"}
                </small>
              </div>

              <div className="notification-actions">
                {!notification.read ? (
                  <button
                    className="ghost-button notification-btn"
                    onClick={() => handleMarkRead(notification._id)}
                    type="button"
                  >
                    Mark read
                  </button>
                ) : (
                  <span className="read-badge">✓ Read</span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default NotificationsPanel;