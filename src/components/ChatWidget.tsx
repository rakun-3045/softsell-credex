import { useState, useRef, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { FaComments, FaTimes, FaRobot, FaUser, FaExpand, FaCompress } from 'react-icons/fa';

// Define types for chat messages
interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Props interface to receive dark mode state
interface ChatWidgetProps {
  isDarkMode?: boolean;
}

// API configuration
const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const ChatWidget = ({ isDarkMode = false }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm SoftSell's AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Store conversation history for context
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([
    { role: "system", content: "You are SoftSell's AI assistant. You help users with information about software license resale. Be helpful, friendly, and concise. Provide accurate information about the process of selling software licenses, pricing, legality, and payment methods. The company typically offers 40-70% of retail value for licenses. The process usually takes 3-5 business days from submission to payment." },
    { role: "assistant", content: "👋 Hi there! I'm SoftSell's AI assistant. How can I help you today?" }
  ]);
  
  // Position state for draggable functionality
  const [position, setPosition] = useState({ x: window.innerWidth - 20, y: window.innerHeight - 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const originalPositionRef = useRef({ x: 0, y: 0 });
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Call LLM API for AI response
  const fetchAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        console.error('API request failed:', await response.text());
        return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);

      return aiResponse;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "I apologize, but I've encountered an error. Please try again later.";
    }
  };

  const simulateTyping = (response: string) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(1500, response.length * 10);
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage(response, false);
    }, typingDelay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Add user message
    addMessage(inputMessage, true);
    
    // Set typing indicator
    setIsTyping(true);
    
    // Get and add AI response with real API call
    const aiResponse = await fetchAIResponse(inputMessage);
    simulateTyping(aiResponse);
    
    // Clear input
    setInputMessage('');
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text,
      isUser,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Theme-specific colors
  const theme = {
    chatBg: isDarkMode ? '#2c3034' : 'white',
    messageBgUser: 'var(--primary-color)',
    messageBgBot: isDarkMode ? '#3a3f44' : '#f1f3f5',
    messageTextUser: 'white',
    messageTextBot: isDarkMode ? '#f8f9fa' : 'var(--text-dark)',
    cardBg: isDarkMode ? '#212529' : 'white',
    inputBg: isDarkMode ? '#3a3f44' : 'white',
    inputText: isDarkMode ? '#f8f9fa' : '#212529',
    mutedText: isDarkMode ? '#adb5bd' : '#6c757d',
    typingIndicatorColor: isDarkMode ? '#8c8e91' : '#adb5bd',
    border: isDarkMode ? '#495057' : '#dee2e6',
  };

  // Responsive size calculation based on screen size and expansion state
  const getChatWindowSize = () => {
    let width = isExpanded ? '450px' : '350px';
    let height = isExpanded ? '600px' : '500px';
    
    if (window.innerWidth <= 768) {
      width = isExpanded ? '90vw' : '85vw';
      height = isExpanded ? '70vh' : '60vh';
    }
    
    return { width, height };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOpen) return;
    
    const button = chatButtonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    originalPositionRef.current = position;
    setIsDragging(true);
    
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
    
    e.preventDefault();
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
  };
  
  useEffect(() => {
    setPosition({ x: window.innerWidth - 20, y: window.innerHeight - 20 });
    localStorage.removeItem('chatWidgetPosition');
    
    const handleResize = () => {
      setPosition({ x: window.innerWidth - 20, y: window.innerHeight - 20 });
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  const getChatWindowPosition = () => {
    return { bottom: 90, right: 20 };
  };

  const getToggleButtonSize = () => {
    return window.innerWidth <= 768 ? '70px' : '60px';
  };

  const { width, height } = getChatWindowSize();
  const toggleButtonSize = getToggleButtonSize();
  const chatWindowPosition = getChatWindowPosition();

  return (
    <div className="chat-widget">
      <Button 
        ref={chatButtonRef}
        onClick={toggleChat} 
        onMouseDown={handleMouseDown}
        className="chat-toggle-btn" 
        variant="primary" 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: toggleButtonSize,
          height: toggleButtonSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1050,
          fontSize: '1.2rem',
          cursor: isOpen ? 'pointer' : 'grab',
          transition: isDragging ? 'none' : 'box-shadow 0.3s ease'
        }}
      >
        {isOpen ? <FaTimes size={28} /> : <FaComments size={28} />}
      </Button>
      
      {isOpen && (
        <Card 
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width,
            height,
            maxWidth: '95vw',
            maxHeight: '80vh',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '12px',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.cardBg,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Card.Header className="bg-primary text-white py-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaRobot className="me-2" size={24} />
                <h5 className="mb-0">SoftSell Assistant</h5>
              </div>
              <div>
                <Button 
                  variant="link" 
                  className="text-white p-0 me-3" 
                  onClick={toggleExpand}
                  aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                >
                  {isExpanded ? <FaCompress size={18} /> : <FaExpand size={18} />}
                </Button>
                <Button 
                  variant="link" 
                  className="text-white p-0" 
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  <FaTimes size={20} />
                </Button>
              </div>
            </div>
          </Card.Header>
          
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.chatBg
            }}
          >
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`d-flex ${message.isUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}
              >
                <div 
                  style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: message.isUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
                    backgroundColor: message.isUser ? theme.messageBgUser : theme.messageBgBot,
                    color: message.isUser ? theme.messageTextUser : theme.messageTextBot,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                    fontSize: isExpanded ? '1rem' : '0.95rem'
                  }}
                >
                  <div className="d-flex align-items-center mb-1">
                    {!message.isUser && <FaRobot className="me-2" size={16} />}
                    {message.isUser && <FaUser className="me-2" size={16} />}
                    <small style={{ color: theme.mutedText }}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                  <div>{message.text}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div 
                  style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '15px 15px 15px 0',
                    backgroundColor: theme.messageBgBot,
                    color: theme.messageTextBot
                  }}
                >
                  <div className="typing-indicator">
                    <span style={{ backgroundColor: theme.typingIndicatorColor }}></span>
                    <span style={{ backgroundColor: theme.typingIndicatorColor }}></span>
                    <span style={{ backgroundColor: theme.typingIndicatorColor }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <Card.Footer className="p-3 border-top" style={{ 
            borderColor: theme.border, 
            backgroundColor: theme.chatBg 
          }}>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={handleInputChange}
                  autoFocus
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.inputText,
                    borderColor: theme.border,
                    padding: '0.75rem',
                    fontSize: '1rem'
                  }}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="ms-2 px-3"
                  disabled={inputMessage.trim() === ''}
                  size={isExpanded ? "lg" : "md"}
                >
                  Send
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
      
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: bounce 1.5s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        @media screen and (max-width: 768px) {
          .chat-widget {
            font-size: 16px;
          }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(var(--primary-color-rgb), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb), 0); }
        }
        
        .chat-toggle-btn:hover {
          animation: pulse 1.5s infinite;
          cursor: grab;
        }
        
        .chat-toggle-btn:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;