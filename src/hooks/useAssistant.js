import { useCallback, useState } from 'react';

const initialAssistantMessage = {
  id: 'assistant-1',
  role: 'assistant',
  text: 'Hello and welcome to Toyota Bahrain! How can I assist you today? Feel free to ask about our vehicles or any other questions you may have.'
};

function getBotReply(userText) {
  const normalized = userText.trim().toLowerCase();

  if (!normalized) {
    return 'Please type a question so I can help you.';
  }

  if (normalized.includes('price') || normalized.includes('price')) {
    return 'You can view pricing on the vehicle details. If you want, I can tell you the starting price for any specific model.';
  }

  if (normalized.includes('color') || normalized.includes('white') || normalized.includes('gray') || normalized.includes('silver')) {
    return 'We have color options available for each model. Select a vehicle and I can tell you which colors are available.';
  }

  if (normalized.includes('gallery') || normalized.includes('photos') || normalized.includes('images')) {
    return 'You can rotate the vehicle using drag or scroll if there are multiple images available for that color.';
  }

  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return 'Hi there! What would you like to know about our Toyota vehicles today?';
  }

  return 'I can help with model details, color options, pricing, and gallery behavior. Ask me about any of those topics!';
}

export function useAssistant() {
  const [messages, setMessages] = useState([initialAssistantMessage]);

  const sendMessage = useCallback((text) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text
    };

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: getBotReply(text)
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
  }, []);

  return { messages, sendMessage };
}
