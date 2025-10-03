import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:9999');
const ChatWindow = ({ currentUser, recipient }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const room = [currentUser?.id, recipient?.id].sort().join('_');

  useEffect(() => {
    // Thêm kiểm tra để đảm bảo currentUser và recipient đã tồn tại
    if (!currentUser || !recipient) {
      return;
    }

    // const room = [currentUser.id, recipient.id].sort().join('_');

    socket.emit('joinRoom', { room });

    socket.on('loadHistory', (history) => {
      console.log('Lịch sử chat đã được tải:', history);
      setChatHistory(history);
    });

    socket.on('receiveMessage', (newMessage) => {
      if (newMessage.room === room) {
        setChatHistory(prev => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('loadHistory');
      socket.off('receiveMessage');
    };

  }, [currentUser, recipient]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room,
        sender: currentUser,
        text: message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', messageData);
      // setChatHistory(prev => [...prev, messageData]); // Hiển thị ngay tin nhắn của mìnhr
      setMessage('');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h4>Chat with {recipient.name}</h4>
      <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #eee', marginBottom: '10px' }}>
        {chatHistory.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender.name}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message..."
          style={{ width: '80%' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;