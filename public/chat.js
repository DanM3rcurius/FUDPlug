const axios = require('axios'); // Import Axios

document.addEventListener('DOMContentLoaded', async () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');

    // Fetch session ID from the server
    let sessionId = '';
    try {
        const response = await axios.get('/session-id');
        sessionId = response.data.sessionId;
    } catch (error) {
        console.error('Error fetching session ID:', error);
    }

    // Function to handle sending messages
    sendButton.addEventListener('click', () => {
        sendMessage(chatInput.value, sessionId);
        chatInput.value = '';
    });

    // Define the sendMessage function here, using the agentPOST function from MagickML
    async function sendMessage(prompt, sessionId) {
        try {
            const response = await axios.post('/api/chat', {
                prompt,
                sessionId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const data = response.data;
            // Here, you should add the logic to display the response in the chat window
            console.log(data); // For now, just logging the response
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle the error (e.g., show an error message in the chat window)
        }
    }
        
});