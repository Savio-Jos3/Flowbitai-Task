'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  error?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-with-data`,
        { question: input },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.data;

      const assistantMessage: Message = {
        role: 'assistant',
        content: `Found ${data.row_count} result${data.row_count !== 1 ? 's' : ''}`,
        sql: data.sql,
        results: data.results
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error.',
        error: error.response?.data?.error || 'Failed to process question'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Chat with Your Data</h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about your invoices, vendors, and analytics
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Ask me anything about your data!
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "How many invoices are there?",
                "What is the total spend?",
                "Show top 5 vendors by spend",
                "Average invoice value?"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Message Content */}
              <p className={msg.role === 'user' ? 'text-white' : 'text-gray-900'}>
                {msg.content}
              </p>

              {/* SQL Query */}
              {msg.sql && (
                <div className="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                  {msg.sql}
                </div>
              )}

              {/* Results Table */}
              {msg.results && msg.results.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(msg.results[0]).map((key) => (
                          <th
                            key={key}
                            className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.results.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.values(row).map((val: any, i) => (
                            <td
                              key={i}
                              className="border border-gray-300 px-4 py-2 text-gray-900"
                            >
                              {val !== null ? String(val) : 'null'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Error */}
              {msg.error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
                  {msg.error}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your data..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
