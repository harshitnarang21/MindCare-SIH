import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello${user ? ` ${user.name}` : ''}! I'm MindCare AI, your personal mental health assistant. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = {
        greeting: [
          "Thank you for reaching out. It takes courage to talk about your feelings. What's been on your mind lately?",
          "I'm here to support you. Can you tell me more about what's been causing you stress?",
          "I appreciate you sharing with me. What aspect of your academic life would you like to discuss?"
        ],
        stress: [
          "I understand that academic stress can feel overwhelming. Let's work through this together. What specific situations are causing you the most stress?",
          "Stress is a natural response, but we can develop healthy coping strategies. Would you like me to suggest some evidence-based techniques?",
          "Your feelings are completely valid. Academic pressure affects many students. What support systems do you currently have in place?"
        ],
        anxiety: [
          "Anxiety can be challenging to navigate, especially in academic settings. You're not alone in feeling this way. What triggers your anxiety most?",
          "Thank you for being open about your anxiety. Have you noticed any patterns in when these feelings tend to arise?",
          "It's important to acknowledge these feelings. Would you like to explore some mindfulness techniques that can help manage anxiety?"
        ],
        help: [
          "I'm here to provide support and guidance. Remember, seeking help is a sign of strength. What kind of support would be most helpful for you right now?",
          "You've taken an important step by reaching out. Let's explore some resources and strategies that might help you feel more balanced.",
          "Mental health support is essential for academic success. Would you like me to suggest some specific resources or coping strategies?"
        ],
        default: [
          "I hear you, and your feelings are important. Can you tell me more about what you're experiencing?",
          "Thank you for sharing that with me. How has this been affecting your daily life and studies?",
          "I want to make sure I understand correctly. Could you elaborate on what you're going through?"
        ]
      };

      let responseCategory = 'default';
      const message = userMessage.toLowerCase();
      
      if (message.includes('stress') || message.includes('overwhelm') || message.includes('pressure')) {
        responseCategory = 'stress';
      } else if (message.includes('anxious') || message.includes('anxiety') || message.includes('worry')) {
        responseCategory = 'anxiety';
      } else if (message.includes('help') || message.includes('support') || message.includes('better')) {
        responseCategory = 'help';
      } else if (message.includes('hello') || message.includes('hi') || message.includes('good') || message.includes('fine')) {
        responseCategory = 'greeting';
      }

      const responseOptions = responses[responseCategory];
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(inputMessage);
    setInputMessage('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modern-chat-container">
      <div className="chat-header">
        <div className="ai-avatar">
          <div className="avatar-icon">🧠</div>
          <div className="online-indicator"></div>
        </div>
        <div className="ai-info">
          <h3>MindCare AI Assistant</h3>
          <p className="ai-status">Online • Ready to help</p>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Clear Chat">🗑️</button>
          <button className="action-btn" title="Settings">⚙️</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender}`}
          >
            <div className="message-avatar">
              {message.sender === 'ai' ? (
                <div className="ai-avatar-small">🧠</div>
              ) : (
                <div className="user-avatar-small">
                  {user?.picture ? (
                    <img src={user.picture} alt="You" />
                  ) : (
                    <div className="default-avatar">👤</div>
                  )}
                </div>
              )}
            </div>
            <div className="message-content">
              <div className={`message-bubble ${message.sender}`}>
                <p>{message.text}</p>
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper ai">
            <div className="message-avatar">
              <div className="ai-avatar-small">🧠</div>
            </div>
            <div className="message-content">
              <div className="message-bubble ai typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share your thoughts or ask for support..."
              className="chat-input"
              autoComplete="off"
            />
            <button
              type="submit"
              className="send-button"
              disabled={inputMessage.trim() === ''}
            >
              <span className="send-icon">✈️</span>
            </button>
          </div>
        </form>
        <div className="chat-suggestions">
          <button
            onClick={() => setInputMessage("I'm feeling stressed about my studies")}
            className="suggestion-chip"
          >
            😰 Academic Stress
          </button>
          <button
            onClick={() => setInputMessage("I need help managing my anxiety")}
            className="suggestion-chip"
          >
            😟 Anxiety Help
          </button>
          <button
            onClick={() => setInputMessage("Can you suggest some coping strategies?")}
            className="suggestion-chip"
          >
            💡 Coping Strategies
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
