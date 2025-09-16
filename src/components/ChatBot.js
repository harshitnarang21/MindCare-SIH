import React, { useState, useEffect, useRef } from 'react';

const mentalHealthResponses = {
  // [All your existing response data - stays exactly the same]
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good evening', 'namaste'],
    responses: [
      "Hello! I'm MindCare AI, your mental health support companion. I'm here to listen and help you navigate through difficult times. How are you feeling today?",
      "Hi there! Welcome to MindCare. I'm trained to provide mental health support and resources. What's on your mind right now?",
      "Namaste! I'm here to provide a safe space for you to share your thoughts and feelings. How can I support you today?",
      "Hello! I'm glad you're here. Taking the first step to seek support shows strength. What would you like to talk about?"
    ]
  },
  // [... all other categories remain the same ...]
};

const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point living', 'self harm', 'hurt myself', 'want to die', 'ending my life', 'not worth living'];

const quickActions = [
  "I'm feeling anxious and overwhelmed",
  "I'm having trouble sleeping and can't relax", 
  "I feel sad and hopeless about everything",
  "I'm struggling with academic pressure",
  "I feel lonely and isolated",
  "I'm having relationship problems",
  "I need emergency help right now"
];

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm MindCare AI, your personal mental health support companion. I'm here to provide a safe, non-judgmental space where you can share your thoughts and feelings. Remember, I'm trained to recognize when you might need additional support and can connect you with professional resources. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true); // ← Added this
  const messagesEndRef = useRef(null);

  // [All your existing functions stay exactly the same...]

  const handleSendMessage = (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev.slice(-5), messageText]);
    setInput('');
    setIsTyping(true);

    // Auto-hide quick actions after first user message
    if (messages.length === 1) {
      setShowQuickActions(false);
    }

    // [Rest of function stays the same...]
  };

  // ✅ FIXED: Added the missing handleQuickAction function
  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  // [All other functions stay exactly the same...]

  return (
    <div className="chat-container">
      {/* [All existing JSX until quick-actions...] */}

      {showQuickActions && (
        <div className="quick-actions">
          <div className="quick-actions-header">
            <h4>💡 Quick Support Topics:</h4>
            <button 
              className="hide-quick-actions-btn"
              onClick={() => setShowQuickActions(false)}
              title="Hide quick topics"
            >
              ×
            </button>
          </div>
          <div className="quick-buttons">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-button"
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showQuickActions && (
        <div className="show-quick-actions">
          <button 
            className="show-quick-actions-btn"
            onClick={() => setShowQuickActions(true)}
          >
            💡 Show Quick Topics
          </button>
        </div>
      )}

      {/* [Rest of your JSX stays exactly the same...] */}
    </div>
  );
};

export default ChatBot;
