import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, Badge } from 'react-bootstrap';
import useUserAxios from "../hooks/useUserAxios";
import useToast from "../hooks/useToast";
import { Link } from 'react-router';

function DashboardMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useUserAxios();
  const { setToastMessage } = useToast();

  const getMessages = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("/api/product/view-messages");
      setMessages(resp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: "Failed to load messages"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadMessages = messages.filter(msg => msg.status === "unread");
  
  const recentUnread = unreadMessages
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center justify-content-between bg-white">
        <div className="d-flex align-items-center gap-2">
          <MessageSquare className="text-primary" size={20} />
          <h3 className="mb-0 fs-5 fw-semibold">Unread Messages</h3>
        </div>
        <Badge bg="primary" pill className="px-3 py-2">
          {loading ? "..." : unreadMessages.length}
        </Badge>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center text-muted py-4">
            Loading messages...
          </div>
        ) : unreadMessages.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {recentUnread.map((message) => (
              <div key={message.messageId} className="d-flex align-items-center justify-content-between py-2">
                <div className="flex-grow-1 min-width-0">
                  <p className="mb-0 text-sm fw-medium text-truncate">
                    {message.Email}
                  </p>
                  <p className="mb-0 text-sm text-muted text-truncate">
                    {message.Message}
                  </p>
                </div>
                <span className="text-muted ms-3" style={{ fontSize: '0.75rem' }}>
                {formatDate(message.createdAt || new Date())}
                </span>
              </div>
            ))}
            {unreadMessages.length > 3 && (
              <div className="d-flex align-items-center justify-content-between py-2">
                <p className="mb-0 text-sm text-primary fw-medium pt-2">
                  +{unreadMessages.length - 3} more unread messages

                  
                </p>
              <Link to="/admin/messages" className="ms-2 underline">View All</Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted py-3">
            No unread messages
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default DashboardMessages;