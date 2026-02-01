import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  User,
  Clock,
  Eye,
  CheckCircle,
  Reply,
  ChevronLeft,
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { getAllSupportMessages, updateSupportMessageStatus, sendSupportReply } from '../api/supportApi';

export default function SupportMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMessage, setSidebarMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };

      const response = await getAllSupportMessages(params);
      setMessages(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      await updateSupportMessageStatus(messageId, newStatus);
      // Update local state
      setMessages(messages.map(msg =>
        msg._id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread': return <Mail size={16} />;
      case 'read': return <Eye size={16} />;
      case 'replied': return <CheckCircle size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="content">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, marginBottom: '20px', color: 'var(--text-primary)' }}>Support Messages</h2>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{message.name}</div>
                            <div className="text-sm text-gray-500">{message.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {message.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {message.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(message.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSidebarMessage(message);
                            setSidebarOpen(true);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {sidebarOpen && sidebarMessage && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            background: 'var(--bg-main)',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  margin: 0,
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Message Details
                </h3>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setSidebarMessage(null);
                    setReplyText('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                {/* Message Information */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      Message Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Message ID:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'monospace' }}>
                          {sidebarMessage._id}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Date Submitted:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                          {formatDate(sidebarMessage.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      Customer Details
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Name:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                          {sidebarMessage.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Email:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                          {sidebarMessage.email}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Subject:</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>
                          {sidebarMessage.subject}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Status */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      Message Status
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Current Status:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          backgroundColor: sidebarMessage.status === 'unread' ? '#ef4444' :
                                         sidebarMessage.status === 'read' ? '#3b82f6' : '#10b981',
                          color: 'white'
                        }}>
                          {sidebarMessage.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      Message Content
                    </h4>
                    <div style={{
                      background: 'var(--bg-secondary)',
                      padding: '16px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {sidebarMessage.message}
                    </div>
                  </div>
                </div>

                {/* Reply Section */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      Send Reply
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={6}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                        placeholder="Type your reply message here..."
                      />
                      <button
                        onClick={async () => {
                          if (!replyText.trim()) {
                            alert('Please enter a reply message');
                            return;
                          }

                          setSendingReply(true);
                          try {
                            await sendSupportReply(sidebarMessage._id, replyText);
                            await handleStatusUpdate(sidebarMessage._id, 'replied');
                            setSidebarOpen(false);
                            setSidebarMessage(null);
                            setReplyText('');
                          } catch (error) {
                            console.error('Failed to send reply:', error);
                            alert('Failed to send reply. Please try again.');
                          } finally {
                            setSendingReply(false);
                          }
                        }}
                        disabled={sendingReply || !replyText.trim()}
                        style={{
                          padding: '12px',
                          background: sendingReply || !replyText.trim() ? 'var(--text-secondary)' : 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: sendingReply || !replyText.trim() ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          opacity: sendingReply || !replyText.trim() ? 0.6 : 1
                        }}
                      >
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999
            }}
            onClick={() => {
              setSidebarOpen(false);
              setSidebarMessage(null);
              setReplyText('');
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};
