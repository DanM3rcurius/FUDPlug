document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const messageContainer = document.getElementById('message-container');
    let sessionId = Date.now(); // Example session ID

    // Function to handle sending messages
    sendButton.addEventListener('click', function() {
        let messageText = chatInput.value.trim();
        if (messageText) {
            sendMessage(messageText, sessionId);
            chatInput.value = '';
            chatInput.style.height = 'auto'; // Reset the text area height
        }
    });

    function resizeTextarea() {
        // This line resets the height allowing the scrollHeight to be accurate
        chatInput.style.height = 'auto';
        // Set the height to the scrollHeight plus a little extra space
        chatInput.style.height = (chatInput.scrollHeight + 2) + 'px';
    }

    // Listen for input event on textarea
    chatInput.addEventListener('input', resizeTextarea);

    // Initialize the textarea size
    resizeTextarea();

    // Define the sendMessage function here, using fetch
    async function sendMessage(prompt, sessionId) {
        // Display operator's message
        addMessageToChatBox('You', prompt, 'operator');

        // Insert loader to indicate the bot is "typing"
        const loader = document.createElement('div');
        loader.className = 'loader';
        messageContainer.appendChild(loader);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, sessionId }),
            });

            // Remove loader once the response is received
            messageContainer.removeChild(loader);

            if (response.ok) {
                const data = await response.json();
                const botResponse = data.result["Output - REST API (Response)"];
                // Display agent's response
                addMessageToChatBox('FUDPlug', botResponse, 'agent');
            } else {
                console.error('Error sending message:', response.status);
                addMessageToChatBox('System', 'Error sending message.', 'agent');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToChatBox('System', 'Error sending message.', 'agent');
            messageContainer.removeChild(loader); // Remove loader in case of error as well
        }
    }

    // Helper function to add messages to the chat box
    function addMessageToChatBox(name, text, sender) {
        const messageElement = document.createElement('div');
        const nameElement = document.createElement('span');
        const textElement = document.createElement('span');

        nameElement.className = 'name';
        nameElement.textContent = name + ': ';
        textElement.className = 'text';
        textElement.textContent = text;

        messageElement.appendChild(nameElement);
        messageElement.appendChild(textElement);

        // Add class based on sender
        messageElement.classList.add('message', sender + '-message');

        messageContainer.appendChild(messageElement);

        // Scroll to the bottom of the chat box to show the latest message
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
