import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Send, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  sender: {
    name: string;
    company: string;
    isCurrentUser: boolean;
  };
  content: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'Jan Kowalski',
      company: 'Orlen',
      isCurrentUser: false
    },
    content: 'Hello, I would like to discuss the margin requirements for EUR/PLN transactions.',
    timestamp: '2024-03-15 14:30:22'
  },
  {
    id: '2',
    sender: {
      name: 'Anna Nowak',
      company: 'Bank',
      isCurrentUser: true
    },
    content: 'Of course. Currently, your margin group is set to B with a 0.0003 spread. Would you like to discuss adjusting this?',
    timestamp: '2024-03-15 14:31:15'
  },
  {
    id: '3',
    sender: {
      name: 'Jan Kowalski',
      company: 'Orlen',
      isCurrentUser: false
    },
    content: 'Yes, given our increased transaction volume, we would like to request a review for group A classification.',
    timestamp: '2024-03-15 14:32:30'
  },
  {
    id: '4',
    sender: {
      name: 'Anna Nowak',
      company: 'Bank',
      isCurrentUser: true
    },
    content: 'I understand. Let me check your recent transaction history and volume metrics.',
    timestamp: '2024-03-15 14:33:45'
  },
  {
    id: '5',
    sender: {
      name: 'Anna Nowak',
      company: 'Bank',
      isCurrentUser: true
    },
    content: 'I can see that your average monthly volume has indeed increased significantly. I will initiate the margin group review process.',
    timestamp: '2024-03-15 14:35:10'
  }
];

const ChatOngoing = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: crypto.randomUUID(),
      sender: {
        name: 'Anna Nowak',
        company: 'Bank',
        isCurrentUser: true
      },
      content: newMessage,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb and Header */}
      <div className="p-6 pb-0">
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <span>Chat</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">Ongoing Conversation</span>
        </div>
      </div>

      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Jan Kowalski</h2>
            <p className="text-sm text-gray-600">Orlen</p>
          </div>
          <div className="text-sm text-gray-500">
            Started: {messages[0]?.timestamp}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {/* Conversation Start Marker */}
        <div className="flex justify-center">
          <div className="bg-gray-200 rounded-full px-4 py-1 text-sm text-gray-600">
            Conversation Started
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] ${
                message.sender.isCurrentUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900'
              } rounded-lg shadow-sm p-4`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className={`font-medium text-sm ${
                  message.sender.isCurrentUser ? 'text-blue-100' : 'text-blue-600'
                }`}>
                  {message.sender.name}
                </span>
                <span className={`text-xs ml-2 ${
                  message.sender.isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.split(' ')[1]}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex space-x-2 pb-2">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-2 rounded-full ${
                newMessage.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOngoing;
