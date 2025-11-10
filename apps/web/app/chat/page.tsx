'use client';

import { useState } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat-with-data', {
        question: input
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: `Found ${response.data.data.row_count} results`,
        sql: response.data.data.sql,
        results: response.data.data.results
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with Data</h1>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-4 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <p className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}</p>
            <p>{msg.content}</p>
            
            {msg.sql && (
              <div className="mt-2">
                <p className="text-sm font-mono bg-gray-800 text-white p-2 rounded">
                  {msg.sql}
                </p>
              </div>
            )}
            
            {msg.results && msg.results.length > 0 && (
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr>
                      {Object.keys(msg.results[0]).map(key => (
                        <th key={key} className="border px-4 py-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.results.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val: any, i) => (
                          <td key={i} className="border px-4 py-2">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question about your data..."
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
