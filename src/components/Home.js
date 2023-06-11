// Home.js

import React from 'react';

const Home = ({ startChat }) => {
    return (
        <div>
            <h1>Welcome to the ChatGPT App</h1>
            <p>Click the button below to start chatting with AI.</p>
            <button onClick={startChat}>Start Chatting</button>
        </div>
    );
}

export default Home;
