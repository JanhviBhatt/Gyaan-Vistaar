'use client'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    //Checks if the input is empty or just spaces.
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const res = await fetch('/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();
    const botMsg = { sender: 'bot', text: data.answer || 'Sorry, no answer found.' };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-900 text-white p-4 text-center text-2xl font-bold">
         ISRO Help Bot
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg w-fit max-w-full ${
                msg.sender === 'user' ? 'ml-auto bg-indigo-900 text-white' : 'mr-auto bg-white text-black shadow'
              }`}
            >
              {msg.text}
            </div>
          ))}
            {/* Scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white p-4 shadow-inner">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-indigo-900"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your space question..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
            {/* onKeydown => When any key is pressed inside the input box, check if it was the Enter key. If yes, then send the message */}
          <button
            onClick={handleSend}
            className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

