import React, { useState, useEffect, useRef } from 'react';

const mentalHealthResponses = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good evening', 'namaste'],
    responses: [
      "Hello! I'm MindCare AI, your mental health support companion. I'm here to listen and help you navigate through difficult times. How are you feeling today?",
      "Hi there! Welcome to MindCare. I'm trained to provide mental health support and resources. What's on your mind right now?",
      "Namaste! I'm here to provide a safe space for you to share your thoughts and feelings. How can I support you today?",
      "Hello! I'm glad you're here. Taking the first step to seek support shows strength. What would you like to talk about?"
    ]
  },
  anxiety: {
    patterns: ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'stress', 'overwhelmed', 'racing heart', 'can\'t breathe', 'sweating'],
    responses: [
      "I understand you're experiencing anxiety. Let's try the 4-7-8 breathing technique: Breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and helps calm your body.",
      "Anxiety can feel overwhelming, but you're not alone. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This brings you back to the present moment.",
      "When anxiety strikes, remember: feelings are temporary, but coping skills last forever. Try progressive muscle relaxation - tense and release each muscle group for 5 seconds, starting from your toes up to your head.",
      "It's completely normal to feel anxious, especially as a student. Consider keeping an anxiety journal to identify triggers. If these feelings persist for more than 2 weeks, please consider speaking with a counselor."
    ]
  },
  depression: {
    patterns: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'worthless', 'lonely', 'numb', 'dark thoughts', 'no motivation'],
    responses: [
      "I'm sorry you're feeling this way. Depression can make everything feel heavy and hopeless, but these feelings are symptoms, not facts about you or your future. You matter, and your life has value.",
      "Depression often tells us lies about ourselves and our worth. Try the 'three good things' exercise: each night, write down three things that went well, no matter how small. This helps retrain your brain to notice positive moments.",
      "When you're depressed, even small tasks feel enormous. That's okay. Try breaking everything into tiny steps. Instead of 'clean room,' try 'put one item away.' Celebrate these small victories - they add up.",
      "You're not alone in this darkness. Many students experience depression, and it's treatable. Consider establishing a daily routine, getting sunlight, and gentle movement. If you're having thoughts of self-harm, please reach out for help immediately."
    ]
  },
  suicide: {
    patterns: ['suicide', 'kill myself', 'end it all', 'better off dead', 'no point living', 'self harm', 'hurt myself', 'want to die', 'ending my life', 'not worth living'],
    responses: [
      "🚨 I'm very concerned about your safety right now. Your life has immense value, even when it doesn't feel that way. Please reach out for immediate help: Call 988 (US), 102 (India), or go to your nearest emergency room. You don't have to face this alone.",
      "🚨 I hear that you're in tremendous pain right now. Suicidal thoughts are a sign that your pain has become unbearable, not that your life isn't worth living. Please call a crisis helpline immediately: 988 (US) or contact campus emergency services. There are people who want to help you through this."
    ],
    crisis: true
  },
  academic: {
    patterns: ['exams', 'studies', 'grades', 'academic pressure', 'failing', 'college stress', 'homework', 'assignments', 'test anxiety', 'study stress'],
    responses: [
      "Academic stress is incredibly common among students. Try the Pomodoro Technique: 25 minutes of focused study, then a 5-minute break. This prevents burnout and improves concentration. Remember, your GPA doesn't define your worth as a person.",
      "Test anxiety is real and treatable. Before exams, try visualization: imagine yourself calmly taking the test and succeeding. Practice good sleep hygiene and avoid cramming. If you're struggling, reach out to academic advisors - they're there to help, not judge.",
      "Feeling overwhelmed with coursework? Try the 'two-minute rule': if something takes less than 2 minutes, do it now. For bigger tasks, break them into smaller chunks. Remember, perfect is the enemy of done - sometimes 'good enough' is actually good enough.",
      "Academic pressure can be intense, but your mental health comes first. Consider talking to professors about extensions if you're struggling. Most are understanding about mental health challenges. Also, utilize campus tutoring services and study groups."
    ]
  },
  sleep: {
    patterns: ['insomnia', 'sleep', 'tired', 'exhausted', 'can\'t sleep', 'nightmares', 'sleeping problems', 'restless'],
    responses: [
      "Sleep problems often accompany stress and mental health issues. Try establishing a wind-down routine: dim lights 1 hour before bed, avoid screens, try reading or gentle stretching. Keep your bedroom cool (65-68°F) and dark.",
      "Good sleep hygiene is crucial for mental health. Avoid caffeine after 2 PM, maintain consistent sleep/wake times even on weekends, and create a relaxing bedtime ritual. If racing thoughts keep you awake, try journaling before bed.",
      "If you're lying awake worrying, try the '4-7-8' breathing technique or progressive muscle relaxation. If you can't fall asleep within 20 minutes, get up and do a quiet activity until you feel sleepy again.",
      "Chronic sleep problems can worsen anxiety and depression. If you've tried good sleep hygiene for 2+ weeks without improvement, consider speaking with a healthcare provider. Sleep disorders are treatable."
    ]
  },
  social: {
    patterns: ['friends', 'social', 'isolated', 'alone', 'relationships', 'lonely', 'social anxiety', 'making friends'],
    responses: [
      "Feeling socially isolated is more common than you think, especially in college. Start small: smile at classmates, join study groups, or attend one campus event that interests you. Quality relationships take time to build.",
      "Social anxiety can make connecting with others feel impossible. Remember that most people are focused on themselves, not judging you. Try joining clubs related to your interests - shared activities make conversations easier.",
      "Building friendships in college can be challenging. Consider becoming a regular at places (library, café, gym) - familiarity breeds connection. Volunteer work is also great for meeting like-minded people while helping others.",
      "If social isolation is affecting your mental health, consider joining our peer support groups. Sometimes talking to others who understand your experience can be incredibly healing. You don't have to navigate this alone."
    ]
  },
  eating: {
    patterns: ['eating', 'food', 'appetite', 'weight', 'body image', 'binge', 'restrict', 'eating disorder'],
    responses: [
      "Changes in eating habits often accompany stress and mental health challenges. Try to maintain regular, balanced meals even when stressed. Eating regularly helps stabilize mood and energy levels.",
      "Body image concerns are incredibly common among students. Remember that social media often shows unrealistic standards. Health comes in many sizes, and your worth isn't determined by your appearance or what you eat.",
      "If you're struggling with your relationship with food, you're not alone. Consider speaking with a counselor who specializes in eating concerns, or contact campus nutrition services for support.",
      "Stress eating or loss of appetite are normal responses to pressure. Try mindful eating: eat slowly, pay attention to hunger/fullness cues, and avoid eating while distracted by screens or studying."
    ]
  },
  family: {
    patterns: ['family', 'parents', 'home', 'family pressure', 'family problems', 'parents fighting', 'homesick'],
    responses: [
      "Family dynamics can significantly impact our mental health, especially when we're away at college. It's okay to set boundaries with family members, even if they don't understand your needs right now.",
      "Being homesick is a normal part of the college experience. Stay connected through video calls, but also allow yourself to build a new support network at school. Balance is key.",
      "Family pressure to succeed can be overwhelming. Remember that you're living your own life, not fulfilling someone else's dreams. Consider having honest conversations with family about your needs and boundaries.",
      "If family problems are affecting your ability to focus on school, consider speaking with a counselor. They can help you develop strategies for managing family stress while maintaining your academic goals."
    ]
  },
  financial: {
    patterns: ['money', 'financial', 'broke', 'expensive', 'student loans', 'financial stress', 'can\'t afford'],
    responses: [
      "Financial stress is incredibly common among students and can significantly impact mental health. Look into campus resources: food pantries, emergency funds, work-study programs, and financial counseling services.",
      "Remember that your current financial situation is temporary. Many successful people struggled financially during college. Focus on long-term goals while seeking immediate support from campus resources.",
      "Consider speaking with financial aid advisors about additional support options. Many students don't realize the full range of resources available to them. Don't let pride prevent you from seeking help you deserve.",
      "Financial anxiety can be overwhelming, but there are always options. Look into budgeting apps, part-time work opportunities on campus, and scholarships you might be eligible for. You're investing in your future."
    ]
  },
  relationships: {
    patterns: ['boyfriend', 'girlfriend', 'breakup', 'relationship', 'dating', 'love', 'heartbreak', 'partner'],
    responses: [
      "Relationship challenges are a normal part of young adulthood. Whether you're dealing with heartbreak, communication issues, or uncertainty, remember that healthy relationships require work from both people.",
      "Breakups can feel devastating, especially when you're already dealing with academic stress. Allow yourself to grieve, but also maintain your routines and lean on friends for support. This pain will lessen with time.",
      "If you're in an unhealthy or abusive relationship, please know that you deserve to be treated with respect and kindness. Campus counseling services can help you navigate difficult relationship situations safely.",
      "Dating in college can be complicated. Focus on building a healthy relationship with yourself first. Know your values and boundaries, and don't compromise your mental health for any relationship."
    ]
  },
  substance: {
    patterns: ['alcohol', 'drinking', 'drugs', 'weed', 'marijuana', 'party', 'substance', 'addiction'],
    responses: [
      "If you're concerned about your substance use, that awareness itself is important. Consider speaking with campus health services - they provide confidential support without judgment.",
      "Many students use alcohol or drugs to cope with stress, anxiety, or depression. While this might provide temporary relief, it often makes mental health symptoms worse over time. There are healthier coping strategies we can explore.",
      "Substance use on campus is common, but if it's interfering with your academics, relationships, or mental health, it might be time to reassess. Campus counseling services can help you explore your relationship with substances.",
      "If you're struggling with addiction, please know that recovery is possible and you deserve support. Look into campus recovery programs, counseling services, or local support groups like AA/NA meetings."
    ]
  },
  motivation: {
    patterns: ['unmotivated', 'no motivation', 'lazy', 'procrastination', 'don\'t care', 'giving up'],
    responses: [
      "Loss of motivation can be a sign of depression, burnout, or feeling overwhelmed. Start with tiny steps: make your bed, take a shower, eat a meal. Sometimes action creates motivation, not the other way around.",
      "Procrastination often comes from perfectionism or fear of failure. Try the 'two-minute rule': commit to working on something for just two minutes. Often, starting is the hardest part.",
      "When everything feels pointless, it can help to reconnect with your values and long-term goals. Why did you come to college? What matters to you? Sometimes we need to rediscover our 'why' to find motivation.",
      "Feeling unmotivated is often your brain's way of saying you need rest, connection, or a change in approach. Consider talking to an academic advisor or counselor about strategies that work with your natural rhythms, not against them."
    ]
  },
  general: {
    patterns: ['help', 'support', 'talk', 'listen', 'understand', 'care', 'worried', 'scared', 'confused'],
    responses: [
      "I'm here to listen without judgment. Sometimes just putting our thoughts into words can help us process difficult emotions. What's been weighing on your mind lately?",
      "It takes courage to reach out for support. That shows real strength, not weakness. I'm here to provide a safe space for you to explore your feelings and find healthy coping strategies.",
      "Everyone needs support sometimes, and that's completely normal. Whether you're dealing with stress, uncertainty, or just need someone to listen, I'm here for you. What would be most helpful right now?",
      "Remember that seeking help is a sign of self-awareness and strength. You don't have to carry your burdens alone. I'm here to support you, and there are many other resources available too."
    ]
  }
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
  const [showQuickActions, setShowQuickActions] = useState(true);
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

  const generateContextualResponse = (userInput, previousMessages) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for crisis keywords first
    const isCrisis = analyzeRiskLevel(userInput);
    if (isCrisis) {
      return {
        response: mentalHealthResponses.suicide.responses[Math.floor(Math.random() * mentalHealthResponses.suicide.responses.length)],
        crisis: true,
        category: 'suicide'
      };
    }

    // Find matching response category with enhanced matching
    let bestMatch = null;
    let maxMatches = 0;

    for (const [category, data] of Object.entries(mentalHealthResponses)) {
      if (!data.patterns) continue;
      
      const matches = data.patterns.filter(pattern => lowerInput.includes(pattern)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = { category, data };
      }
    }

    if (bestMatch && maxMatches > 0) {
      const responseIndex = Math.floor(Math.random() * bestMatch.data.responses.length);
      return {
        response: bestMatch.data.responses[responseIndex],
        crisis: bestMatch.data.crisis || false,
        category: bestMatch.category
      };
    }

    // Enhanced default responses based on conversation context
    const contextResponses = [
      "I hear what you're sharing, and I want you to know that your feelings are valid. Can you tell me more about what's been going on?",
      "It sounds like you're going through a difficult time. I'm here to listen and support you. What's been the most challenging part for you?",
      "Thank you for trusting me with your thoughts. Sometimes just talking about what we're experiencing can help us process it better. How long have you been feeling this way?",
      "I understand this is difficult to talk about. You're being very brave by reaching out for support. What kind of help do you think might be most useful for you right now?",
      "Your feelings matter, and so do you. I'm here to help you work through whatever you're experiencing. What would you like to focus on first?"
    ];

    return {
      response: contextResponses[Math.floor(Math.random() * contextResponses.length)],
      crisis: false,
      category: 'general'
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
    setConversationContext(prev => [...prev.slice(-5), messageText]); // Keep last 5 messages for context
    setInput('');
    setIsTyping(true);

    // Auto-hide quick actions after first user message
    if (messages.length === 1) { // Only welcome message exists
      setShowQuickActions(false);
    }

    // Simulate realistic typing delay
    setTimeout(() => {
      const { response, crisis, category } = generateContextualResponse(messageText, conversationContext);
      
      const botMessage = {
        type: crisis ? 'crisis' : 'bot',
        text: response,
        timestamp: new Date(),
        category: category
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Add additional crisis resources if needed
      if (crisis) {
        setTimeout(() => {
          const crisisResourceMessage = {
            type: 'bot',
            text: "🆘 **Immediate Crisis Resources:**\\n\\n**🇺🇸 United States:**\\n• National Suicide Prevention Lifeline: **988**\\n• Crisis Text Line: Text **HOME** to **741741**\\n\\n**🇮🇳 India:**\\n• National Helpline: **102**\\n• Vandrevala Foundation: **9999 666 555**\\n• AASRA: **91-22-27546669**\\n\\n**🏥 Emergency:** Call **911** or go to your nearest emergency room\\n\\n**🎓 Campus Resources:** Contact your campus counseling center immediately\\n\\n*Remember: You are not alone, and help is always available.*",
            timestamp: new Date(),
            category: 'crisis-resources'
          };
          setMessages(prev => [...prev, crisisResourceMessage]);
        }, 1500);
      }
      
      setIsTyping(false);
    }, Math.random() * 1000 + 1500); // Random delay between 1.5-2.5 seconds
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\\n/g, '<br/>');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h3>🤖 MindCare AI Support</h3>
          <p>Confidential • Safe Space • 24/7 Available</p>
          <div className="chat-status">
            <div className="status-indicator"></div>
            <span>AI Therapist Online</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-bubble">
              <div 
                className="message-content"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
              />
              {message.type === 'crisis' && (
                <div className="crisis-banner">
                  <div className="crisis-icon">🚨</div>
                  <div className="crisis-text">
                    <strong>CRISIS ALERT</strong>
                    <p>Please seek immediate professional help</p>
                  </div>
                </div>
              )}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble typing-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">MindCare AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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

      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            placeholder="Share what's on your mind... I'm here to listen 💙"
            className="chat-input"
            disabled={isTyping}
            maxLength={500}
          />
          <div className="input-actions">
            <span className="char-count">{input.length}/500</span>
            <button
              onClick={() => handleSendMessage()}
              className="send-button"
              disabled={!input.trim() || isTyping}
            >
              <span className="send-icon">📤</span>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <div className="disclaimer-icon">⚠️</div>
        <div className="disclaimer-text">
          <small>
            <strong>Important:</strong> This AI is not a replacement for professional mental health care. 
            If you're experiencing a mental health crisis, please contact emergency services immediately.
            All conversations are confidential and not stored.
          </small>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
