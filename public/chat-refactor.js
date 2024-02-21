function initializeEventListeners() {
    document.getElementById('chat-input').addEventListener('keypress', handleEnterKeyPress);
    document.getElementById('chat-input').addEventListener('blur', adjustScreenView);
}
// Enter sends message
function handleEnterKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('send-btn').click();
    }
}
// Focus on Send button when leaving keyboard view on mobile
function adjustScreenView() {
    setTimeout(function() {
        document.getElementById('send-btn').scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 300);
}
// DOM
document.addEventListener('DOMContentLoaded', function () {
    // Initialize event listeners from above
    initializeEventListeners();
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
    // export button function linkingto backend endpoint
    const exportBtn = document.getElementById('export-chat-btn');

    exportBtn.addEventListener('click', function() {
        const sessionId = /* Retrieve the current session ID somehow */;
        window.open(`/api/export/${sessionId}`, '_blank');
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
                addMessageToChatBox('System', 'My wires got crossed, please try again.', 'agent');
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
