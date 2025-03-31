import React, { useState, useEffect } from 'react';
import styles from './CHATBOT.module.css';
import { matchPriveAPI, isProfileComplete } from '../services/api';

interface Message {
  sender: 'user' | 'gpt';
  message: string;
}

export const CHATBOT: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProfileDone, setIsProfileDone] = useState(false);

  // Start session when component mounts
  useEffect(() => {
    const initSession = async () => {
      try {
        await matchPriveAPI.startSession();
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    };

    initSession();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', message: userMessage }]);

    try {
      // Send message to backend
      const response = await matchPriveAPI.sendMessage(userMessage);
      
      // Add GPT response to chat
      setMessages(prev => [...prev, { sender: 'gpt', message: response.response }]);

      // Check if profile is complete
      if (isProfileComplete(response.response)) {
        setIsProfileDone(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        sender: 'gpt', 
        message: 'Sorry, there was an error. Please try again.' 
      }]);
    }
  };

  return (
    <div className={styles.chatbot}>
      <div className={`${styles.chat} ${isMinimized ? styles.chatMinimized : ''}`}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h2 className={styles.connectionChat}>CONNECTION CHAT</h2>
            <p className={styles.poweredByLarkBerry}>Powered by LarkBerry</p>
          </div>
          <button 
            className={styles.minimizeButton}
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          />
        </div>

        <div className={styles.chatFeed}>
          {messages.map((msg, index) => (
            <div key={index} className={styles[msg.sender === 'user' ? 'userMessage' : 'gptMessage']}>
              {msg.message}
            </div>
          ))}
          {isProfileDone && (
            <div className={styles.completionMessage}>
              Your profile is complete! Please check your email for your compatibility report.
            </div>
          )}
        </div>

        <form className={styles.inputArea} onSubmit={handleSendMessage}>
          <input
            type="text"
            className={styles.inputField}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isProfileDone}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={!inputMessage.trim() || isProfileDone}
            aria-label="Send message"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
};
