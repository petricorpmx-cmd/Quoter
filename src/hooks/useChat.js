import { useState, useRef, useEffect } from 'react';
import { callGeminiAI } from '../services/ai/geminiService';
import { prepareContextData } from '../utils/calculations';
import { calcularValores } from '../utils/calculations';

export const useChat = (items, ivaRate) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: '¡Hola! He corregido los errores del sistema y añadido gráficas comparativas. Ahora puedes visualizar el ahorro real entre proveedores. ¿En qué puedo ayudarte hoy?' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const text = chatInput;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    const calcularConIva = (costo, aplicaIva, margen, cantidad) => 
      calcularValores(costo, aplicaIva, margen, cantidad, ivaRate);
    
    const contextData = prepareContextData(items, calcularConIva);
    const res = await callGeminiAI(text, contextData, ivaRate);
    
    setMessages(prev => [...prev, { role: 'assistant', text: res.text, sources: res.sources }]);
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return {
    isChatOpen,
    setIsChatOpen,
    chatInput,
    setChatInput,
    messages,
    isTyping,
    chatEndRef,
    handleSendMessage
  };
};
