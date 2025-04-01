import { useEffect, useState } from "react";
import useUserAxios from "../hooks/useUserAxios";
import useToast from "../hooks/useToast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  MessageSquare, 
  Search,
  Calendar,
  CircleDot,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import useMessages from "../hooks/useMessages";

const Messages = () => {
  const axios = useUserAxios();
  const { setToastMessage } = useToast();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");  
  const{newMessage, clearMessages}=useMessages()

  const getMessages = async () => {
    try {
      const resp = await axios.get("/api/product/view-messages");
      setMessages(resp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      });
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`/api/product/messages/${messageId}/read`);
      getMessages()
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      });
    }
  };
  const deleteMessage = async (messageId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/product/messages/${messageId}`);
      setMessages(messages.filter(msg => msg.messageId !== messageId));
      if (selectedMessage?.messageId === messageId) {
        setSelectedMessage(null);
      }
      setToastMessage({
        variant: "success",
        message: "Message deleted successfully",
      });
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      });
    }
  };
  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    if (!message.status=="unread") {
      markAsRead(message.messageId);
    }
  };

  const filteredAndSortedMessages = messages
    .filter(message => {
      const matchesSearch = message.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.Message.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === "unread") return message.status=="unread" && matchesSearch;
      if (filter === "read") return message.status=='read' && matchesSearch;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (a.status=="unread" === b.status=="unread") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.status=="unread"? 1 : -1;
    });

  useEffect(() => {
    getMessages();
 
  }, []);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.status=="unread").length;
  };
 useEffect(() => {
  clearMessages();
 },[])
  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-2rem)] flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Client Messages</h2>
            <p className="text-gray-500 mt-1">Manage and respond to customer inquiries</p>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-full">
            <span className="text-blue-700 font-medium">{getUnreadCount()} unread</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-2/5 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all" ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "unread" ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "read" ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Read
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredAndSortedMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageSelect(message)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedMessage?.messageId === message.messageId ? 'bg-blue-50' : ''
                } ${!message.status=="unread" ? 'bg-blue-50/40' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.status=="unread" ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {message.status=="read" ? (
                      <CheckCircle2 className="w-5 h-5 text-gray-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${
                        message.status=="read" ? 'text-gray-700' : 'text-gray-900'
                      }`}>{message.Email}</h3>
                      <span className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(message.createdAt || new Date())}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${
                      message.status=="unread" ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {message.Message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center text-xs text-gray-500">
                        <Package className="w-3 h-3 mr-1" />
                        ID: {message.productId}
                      </span>
                      {!message.status=="unread" && (
                        <span className="flex items-center text-xs text-blue-600 font-medium">
                          <CircleDot className="w-3 h-3 mr-1" />
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col flex-1 bg-gray-50">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Message Details</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.status=="unread" 
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedMessage.status=="unread" ? 'Read' : 'New Message'}
                  </span>
                  <button
                      onClick={(e) => deleteMessage(selectedMessage.messageId, e)}
                      className="p-2 rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedMessage.Email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{selectedMessage.Telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{selectedMessage.Location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Product ID: {selectedMessage.productId}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Message Content</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedMessage.Message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg">Select a message to view details</p>
              <p className="text-sm mt-2">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;