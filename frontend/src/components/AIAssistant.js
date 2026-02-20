import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import './AIAssistant.css';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Academic Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai/chat', { prompt: input });
            const assistantMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please make sure your GROQ_API_KEY is configured.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`ai-assistant-container ${isOpen ? 'open' : ''}`}>
            {isOpen ? (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <h3>Academic AI Agent</h3>
                        <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
                    </div>
                    <div className="ai-chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {isLoading && <div className="message assistant loading">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="ai-chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
                    </form>
                </div>
            ) : (
                <button className="ai-toggle-btn" onClick={() => setIsOpen(true)}>
                    <span className="ai-icon">🤖</span>
                    <span className="ai-label">AI Assistant</span>
                </button>
            )}
        </div>
    );
};

export default AIAssistant;
