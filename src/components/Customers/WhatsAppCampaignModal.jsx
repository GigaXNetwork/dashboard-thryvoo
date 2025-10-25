import React, { useState } from 'react';
import {
  X,
  Send,
  User,
  MessageCircle,
  Loader,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const WhatsAppCampaignModal = ({
  isOpen,
  onClose,
  selectedLead,
  onSendMessage,
  isLoading = false
}) => {
  const [messageData, setMessageData] = useState({
    message: '',
    schedule: 'now',
    scheduledTime: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Message templates for single user
  const messageTemplates = [
    {
      id: 'welcome',
      name: 'Welcome',
      content: `Hi {{name}}, welcome to our service! We're excited to have you on board.`
    },
    {
      id: 'followup',
      name: 'Follow-up',
      content: `Hi {{name}}, just checking in to see if you have any questions. We're here to help!`
    },
    {
      id: 'offer',
      name: 'Special Offer',
      content: `Hello {{name}}, we have an exclusive offer for you!`
    },
    {
      id: 'custom',
      name: 'Custom',
      content: ''
    }
  ];

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    const template = messageTemplates.find(t => t.id === templateId);
    setSelectedTemplate(templateId);
    if (templateId !== 'custom') {
      setMessageData(prev => ({
        ...prev,
        message: template.content
      }));
    }
  };

  // Personalize message with lead data
  const personalizeMessage = (message) => {
    if (!selectedLead) return message;
    
    return message
      .replace(/{{name}}/g, selectedLead.name || 'Customer')
      .replace(/{{email}}/g, selectedLead.email || '')
      .replace(/{{phone}}/g, selectedLead.phone || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageData.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!selectedLead?.phone) {
      alert('This contact does not have a phone number');
      return;
    }

    const personalizedMessage = personalizeMessage(messageData.message);
    
    const messagePayload = {
      ...messageData,
      personalizedMessage,
      lead: selectedLead,
      phone: selectedLead.phone
    };

    await onSendMessage(messagePayload);
  };

  const resetForm = () => {
    setMessageData({
      message: '',
      schedule: 'now',
      scheduledTime: ''
    });
    setSelectedTemplate('');
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !selectedLead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"> {/* Added flex-col */}
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0"> {/* Added flex-shrink-0 */}
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Send WhatsApp Message
              </h2>
              <p className="text-sm text-gray-500">
                Send personalized message to {selectedLead.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form with proper height calculation */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0"> {/* Changed height calculation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">{selectedLead.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-blue-700">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedLead.phone || 'No phone number'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{selectedLead.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Schedule
              </label>
              <select
                value={messageData.schedule}
                onChange={(e) => setMessageData(prev => ({...prev, schedule: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="now">Send Now</option>
                <option value="schedule">Schedule Later</option>
              </select>
              
              {messageData.schedule === 'schedule' && (
                <input
                  type="datetime-local"
                  value={messageData.scheduledTime}
                  onChange={(e) => setMessageData(prev => ({...prev, scheduledTime: e.target.value}))}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Message Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Templates
              </label>
              <div className="grid grid-cols-2 gap-2">
                {messageTemplates.map(template => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-3 border rounded-lg text-sm text-left transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              
              <div className="mb-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const newMessage = messageData.message + ' {{name}}';
                    setMessageData(prev => ({...prev, message: newMessage}));
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  Insert Name
                </button>
              </div>

              <textarea
                value={messageData.message}
                onChange={(e) => setMessageData(prev => ({...prev, message: e.target.value}))}
                rows={4}
                placeholder={`Type your message to ${selectedLead.name}...\n\nUse {{name}} to personalize the message`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
              />
              
              {/* Message Preview */}
              {messageData.message && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm whitespace-pre-wrap">
                      {personalizeMessage(messageData.message)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:text-gray-400"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !messageData.message.trim() || !selectedLead.phone}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isLoading ? 'Sending...' : `Send to ${selectedLead.name}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppCampaignModal;