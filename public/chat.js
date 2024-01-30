document.addEventListener('DOMContentLoaded', async () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');

    // Fetch session ID from the server
    let sessionId = '';
    try {
        const response = await fetch('/session-id');
        const data = await response.json();
        sessionId = data.sessionId;
    } catch (error) {
        console.error('Error fetching session ID:', error);
    }

    // Function to handle sending messages
    sendButton.addEventListener('click', () => {
        sendMessage(chatInput.value, sessionId);
        chatInput.value = '';
    });

    // Define the sendMessage function here, using the agentPOST function from MagickML
    // ...
});

async function agentPOST(id, prompt, sender, sessionId) {
    // Your API logic here
}
