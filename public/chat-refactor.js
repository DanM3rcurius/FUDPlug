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

let globalSessionId = null; // Global variable to store the session ID

// DOM
document.addEventListener('DOMContentLoaded', async function () {
    globalSessionId = await fetchSessionId();   // Fetch and store session ID from the server
    // Initialize event listeners from above
    initializeEventListeners();
    const sendButton = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const messageContainer = document.getElementById('message-container');

    // Function to handle sending messages
    sendButton.addEventListener('click', function() {
        let messageText = chatInput.value.trim();
        if (messageText) {
            sendMessage(messageText, globalSessionId);
            chatInput.value = '';
            chatInput.style.height = 'auto'; // Reset the text area height
        }
    });
    // export button function linkingto backend endpoint
    const exportBtn = document.getElementById('export-chat-btn');

    exportBtn.addEventListener('click', function() {
        if (globalSessionId) {
            window.open(`/api/export/${globalSessionId}`, '_blank'); // retrieve current sessionID
        } else {
            console.error('Session ID is not defined or not fetched yet.');
            // Optionally, provide user feedback here
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
    async function sendMessage(prompt) {
        if (!globalSessionId) {
            console.error('Session ID is not available.');
            return; // Exit the function if sessionId is not available
        }
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
                body: JSON.stringify({ prompt, sessionId: globalSessionId }),
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

async function fetchSessionId() {
    try {
        const response = await fetch('/api/session-id');
        if (response.ok) {
            const data = await response.json();
            return data.sessionId; // Use this session ID for chat and export
        } else {
            console.error('Failed to fetch session ID:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching session ID:', error);
        return null;
    }
}