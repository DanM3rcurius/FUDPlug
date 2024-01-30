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
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, sessionId }),
            });

            if (response.ok) {
                const data = await response.json();
                // Here, you should add the logic to display the response in the chat window
                console.log(data); // For now, just logging the response
            } else {
                console.error('Error sending message:', response.status);
                // Handle the error (e.g., show an error message in the chat window)
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle the error (e.g., show an error message in the chat window)
        }
    }
});
