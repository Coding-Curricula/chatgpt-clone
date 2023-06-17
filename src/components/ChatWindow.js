import React, { useState, useEffect } from 'react';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

import axios from 'axios';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  // Load messages from localStorage
  const loadFromLocalStorage = () => {
    const chatHistory = localStorage.getItem('chatHistory');
    return chatHistory ? JSON.parse(chatHistory) : [];
  }

  // Save messages to localStorage
  const saveToLocalStorage = (chatHistory) => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }

  // Load chat history when the component mounts
  useEffect(() => {
    const chatHistory = loadFromLocalStorage();
    setMessages(chatHistory);
  }, []);


  // Load any saved messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = loadFromLocalStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  const sendMessage = async (userInput) => {
    // Add the user's message to the chat
    const userMessage = {
      sender: 'user',
      text: userInput
    };
    setMessages([...messages, userMessage]);
    saveToLocalStorage([...messages, userMessage]); // Save to local storage

    // Set loading to true while we wait for the AI's response
    setLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.REACT_APP_OPENAI_API_KEY
    };

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }],
    };

    try {
      // Send the user's message to the OpenAI API
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers })

      // Add the AI's response to the chat
      const aiMessage = {
        sender: 'ai',
        text: response.data.choices[0].message.content.trim()
      };
      setMessages([...messages, userMessage, aiMessage]);
      saveToLocalStorage([...messages, userMessage, aiMessage]); // Save to local storage

    } catch (error) {
      console.error(error);
    }

    // Set loading to false now that the AI's response has been added
    setLoading(false);
  };

  const handleInput = (event) => {
    setInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim() !== '') {
      sendMessage(input);
      setInput(''); // clear the input field
    }
  }

  return (
    <div className="chat-window">
      {/* Display all messages */}
      {messages.map((message, index) => (
        <Message
          key={index}
          sender={message.sender}
          text={message.text}
        />
      ))}

      {/* Display a loading indicator when waiting for response */}
      {loading && <LoadingIndicator />}

      {/* Some kind of input + send button to add new user messages */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input type="text" value={input} onChange={handleInput} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}