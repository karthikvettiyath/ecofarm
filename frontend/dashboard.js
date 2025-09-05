document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });

    // Chat functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    chatButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate bot response after a short delay
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrient')) {
            return "For fertilizer recommendations, please use the fertilizer recommendation tool on the dashboard. It will provide personalized advice based on your crop and soil type.";
        } else if (lowerMsg.includes('crop') || lowerMsg.includes('plant')) {
            return "I can help with crop recommendations. Use the crop recommendation tool on the dashboard for suggestions based on your soil and weather conditions.";
        } else if (lowerMsg.includes('pest') || lowerMsg.includes('disease')) {
            return "For pest and disease issues, please describe the symptoms you're seeing on your plants, and I'll try to help identify the problem and suggest solutions.";
        } else if (lowerMsg.includes('weather') || lowerMsg.includes('rain')) {
            return "The weather forecast for your region shows moderate rainfall in the next few days. Perfect conditions for most crops!";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            return "Hello! How can I assist with your farming questions today?";
        } else {
            return "I'm here to help with your agricultural questions. You can ask me about crops, fertilizers, pests, weather, or other farming topics.";
        }
    }

    // Simulate crop recommendation
    document.querySelector('.card:nth-child(1) .btn').addEventListener('click', function() {
        const soilType = document.getElementById('soilType').value;
        const temperature = document.getElementById('temperature').value;
        const rainfall = document.getElementById('rainfall').value;
        
        alert(`Based on your inputs (Soil: ${soilType}, Temp: ${temperature}°C, Rainfall: ${rainfall}mm), I recommend planting corn or wheat this season.`);
    });

    // Simulate fertilizer recommendation
    document.querySelector('.card:nth-child(2) .btn').addEventListener('click', function() {
        const cropType = document.getElementById('cropType').value;
        const soilType = document.getElementById('soilTypeFert').value;
        
        alert(`For ${cropType} in ${soilType} soil, I recommend using nitrogen-rich fertilizer with a balanced NPK ratio.`);
    });
});