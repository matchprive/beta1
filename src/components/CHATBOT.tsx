import React, { useState, useEffect } from 'react';
import styles from './CHATBOT.module.css';
import { matchPriveAPI } from '../services/api';

interface Message {
  id?: string;
  sender: 'user' | 'gpt';
  message: string;
  timestamp?: string;
}

interface ReportStatus {
  generated: boolean;
  sent: boolean;
  path?: string;
}

export const CHATBOT: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProfileDone, setIsProfileDone] = useState(false);
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Start session when component mounts
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const response = await matchPriveAPI.startSession();
        // Add welcome message from GPT
        if (response.initial_message) {
          setMessages([{ sender: 'gpt', message: response.initial_message }]);
        }
      } catch (error) {
        console.error('Failed to start session:', error);
        setMessages([{ 
          sender: 'gpt', 
          message: 'Sorry, we encountered an error starting your session. Please try again.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  // Check report status periodically when profile is complete
  useEffect(() => {
    if (!isProfileDone) return;

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const status = await matchPriveAPI.checkReportStatus(userId);
        setReportStatus(status);
      } catch (error) {
        console.error('Failed to check report status:', error);
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [isProfileDone]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    
    // Add user message to chat immediately
    setMessages(prev => [...prev, { sender: 'user', message: userMessage }]);

    try {
      // Send message to backend
      const response = await matchPriveAPI.sendMessage(userMessage);
      
      // Add GPT response to chat
      setMessages(prev => [...prev, { sender: 'gpt', message: response.message }]);

      // Update profile completion status
      if (response.profile_completed) {
        setIsProfileDone(true);
        if (response.report_status) {
          setReportStatus(response.report_status);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        sender: 'gpt', 
        message: 'Sorry, there was an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
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
              {reportStatus?.sent ? (
                "Your compatibility report has been sent to your email! 📨"
              ) : reportStatus?.generated ? (
                "Your report is ready and will be sent to your email shortly! ⌛"
              ) : (
                "Your profile is complete! We're preparing your compatibility report... 📝"
              )}
            </div>
          )}
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form className={styles.inputArea} onSubmit={handleSendMessage}>
          <input
            type="text"
            className={styles.inputField}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isLoading ? "Please wait..." : "Type your message..."}
            disabled={isProfileDone || isLoading}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={!inputMessage.trim() || isProfileDone || isLoading}
            aria-label="Send message"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
};
