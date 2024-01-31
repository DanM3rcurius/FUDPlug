document.addEventListener('DOMContentLoaded', async () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');

    // Fetch session ID from the server
    let sessionId = '';
    try {
        const response = await fetch('/api/session-id'); // Updated endpoint
        if (response.ok) {
            const data = await response.json();
            sessionId = data.sessionId;
        } else {
            console.error('Error fetching session ID:', response.status);
        }
    } catch (error) {
        console.error('Error fetching session ID:', error);
    } // This closing bracket was misplaced

    // Function to handle sending messages
    sendButton.addEventListener('click', () => {
        sendMessage(chatInput.value, sessionId);
        chatInput.value = '';
    });

    // Define the sendMessage function here, using fetch
    async function sendMessage(prompt, sessionId) {
        // Display operator's message
        addMessageToChatBox('Operator: ' + prompt, 'operator');
    
        // Insert loader to indicate the bot is "typing"
        const chatBox = document.getElementById('chat-box');
        const loader = document.createElement('div');
        loader.className = 'loader';
        chatBox.appendChild(loader);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, sessionId }),
            });
            
            // Remove loader once the response is received
            chatBox.removeChild(loader);

            if (response.ok) {
                const data = await response.json();
                // Assuming the API response structure is { result: { "Output - REST API (Response)": "response text" } }
                const botResponse = data.result["Output - REST API (Response)"];
    
                // Display operator's message
                addMessageToChatBox('Operator: ' + prompt, 'operator');
    
                // Display agent's response
                addMessageToChatBox('Agent: ' + botResponse, 'agent');
            } else {
                console.error('Error sending message:', response.status);
                // Handle the error (e.g., show an error message in the chat window)
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle the error (e.g., show an error message in the chat window)
            // Remove loader in case of error as well
            chatBox.removeChild(loader);
        }
    }
    
    // Helper function to add messages to the chat box
    function addMessageToChatBox(message, sender = 'agent') { // Add sender parameter
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);

        // Add class based on sender
        messageElement.className = sender === 'agent' ? 'agent-message' : 'operator-message' ;

        chatBox.appendChild(messageElement);
    
        // Scroll to the bottom of the chat box to show the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
});
