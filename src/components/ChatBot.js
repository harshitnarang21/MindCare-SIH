import React, { useState, useEffect, useRef } from 'react';

const mentalHealthResponses = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'start', 'help'],
    responses: [
      "Hello! I'm here to provide mental health support. How are you feeling today?",
      "Hi there! I'm a mental health support bot. What's on your mind?",
      "Welcome! I'm here to listen and help. What would you like to talk about?"
    ]
  },
  anxiety: {
    patterns: ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'stress', 'overwhelmed'],
    responses: [
      "I understand you're feeling anxious. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8.",
      "Anxiety can be overwhelming. Try grounding yourself with the 5-4-3-2-1 technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
      "It's normal to feel anxious sometimes. Consider talking to a counselor if these feelings persist for more than 2 weeks."
    ]
  },
  depression: {
    patterns: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'worthless', 'lonely'],
    responses: [
      "I'm sorry you're feeling this way. Remember that these feelings are temporary, even though they feel overwhelming right now.",
      "Depression can make everything seem harder. Try to do one small thing that usually brings you joy, even if you don't feel like it.",
      "You're not alone in feeling this way. Many students experience depression. Have you considered reaching out to a counselor?"
    ]
  },
  suicide: {
    patterns: ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point living', 'self harm', 'hurt myself'],
    responses: [
      "🚨 I'm very concerned about your safety. Please reach out for immediate help: Call 988 (US), 102 (India), or go to your nearest emergency room.",
      "🚨 Your life has value and these feelings can change with proper support. Please call a crisis helpline immediately: 988 (US) or contact campus emergency services."
    ],
    crisis: true
  },
  academic: {
    patterns: ['exams', 'studies', 'grades', 'academic pressure', 'failing', 'college stress'],
    responses: [
      "Academic stress is very common among students. Try breaking your study sessions into 25-minute focused blocks with 5-minute breaks.",
      "Remember that grades don't define your worth. Consider speaking with academic advisors about study strategies or extensions if needed.",
      "Academic pressure can be intense. Make sure you're getting enough sleep and taking regular breaks - your mental health is more important than perfect grades."
    ]
  }
};

const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point living', 'self harm', 'hurt myself'];

const quickActions = [
  "I'm feeling anxious",
  "I'm having trouble sleeping", 
  "I feel overwhelmed with studies",
  "I'm feeling lonely",
  "I need emergency help"
];

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm MindCare AI. I'm here to provide mental health support and resources. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeRiskLevel = (text) => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for crisis keywords first
    const isCrisis = analyzeRiskLevel(userInput);
    if (isCrisis) {
      return {
        response: mentalHealthResponses.suicide.responses[Math.floor(Math.random() * mentalHealthResponses.suicide.responses.length)],
        crisis: true
      };
    }

    // Find matching response category
    for (const [category, data] of Object.entries(mentalHealthResponses)) {
      if (data.patterns && data.patterns.some(pattern => lowerInput.includes(pattern))) {
        return {
          response: data.responses[Math.floor(Math.random() * data.responses.length)],
          crisis: data.crisis || false
        };
      }
    }

    // Default response
    return {
      response: "I understand you're going through something difficult. Can you tell me more about how you're feeling? I'm here to listen and provide support.",
      crisis: false
    };
  };

  const handleSendMessage = (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { response, crisis } = generateResponse(messageText);
      
      const botMessage = {
        type: crisis ? 'crisis' : 'bot',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add additional crisis resources if needed
      if (crisis) {
        setTimeout(() => {
          const crisisResourceMessage = {
            type: 'bot',
            text: "Additional Resources:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Campus Counseling Center: Available during business hours\n• Emergency Services: 911",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, crisisResourceMessage]);
        }, 1000);
      }
      
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>🤖 MindCare AI Support</h3>
        <p>Confidential mental health support chat</p>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.text}
              {message.type === 'crisis' && (
                <div className="crisis-banner">
                  <strong>⚠️ CRISIS ALERT: Please seek immediate help</strong>
                </div>
              )}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              MindCare is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        <h4>Quick Support Options:</h4>
        <div className="quick-buttons">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-button"
              onClick={() => handleQuickAction(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message here..."
          className="chat-input"
          disabled={isTyping}
        />
        <button
          onClick={() => handleSendMessage()}
          className="send-button"
          disabled={!input.trim() || isTyping}
        >
          Send
        </button>
      </div>

      <div className="disclaimer">
        <small>
          ⚠️ This is not a replacement for professional mental health care. 
          If you're in crisis, please contact emergency services immediately.
        </small>
      </div>
    </div>
  );
};

export default ChatBot;
