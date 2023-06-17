import React, { useState } from 'react';
import Home from './components/Home';
import ChatWindow from './components/ChatWindow';
import ErrorBoundary from './components/ErrorBoundary';

import './App.css';

function App() {
    const [inChat, setInChat] = useState(false);

    const startChat = () => {
        setInChat(true);
    };

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>} className="App">
            {inChat ? <ChatWindow /> : <Home startChat={startChat} />}
        </ErrorBoundary>
    );
}

export default App;
