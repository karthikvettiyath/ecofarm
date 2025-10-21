document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard stats - only on dashboard page
    if (document.querySelector('.stat-card')) {
        loadDashboardStats();
    }

    // Logout functionality - only if element exists
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Search functionality - only if element exists
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            } else {
                clearSearchResults();
            }
        });
    }

    // Chat functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatButton && chatInput && chatMessages) {
        chatButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Suggestion buttons functionality
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const message = this.getAttribute('data-message');
                chatInput.value = message;
                sendMessage();
            });
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            addMessage('Typing...', 'bot');
            
            // Send to chatbot API
            fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                // Remove typing indicator
                const messages = document.querySelectorAll('.message');
                const lastMessage = messages[messages.length - 1];
                if (lastMessage && lastMessage.textContent === 'Typing...') {
                    lastMessage.remove();
                }
                
                // Add bot response
                addMessage(data.response, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
                // Remove typing indicator
                const messages = document.querySelectorAll('.message');
                const lastMessage = messages[messages.length - 1];
                if (lastMessage && lastMessage.textContent === 'Typing...') {
                    lastMessage.remove();
                }
                addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
            });
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // Format the text for better display
        const formattedText = text
            .replace(/\n\n/g, '</p><p>')  // Convert double newlines to paragraphs
            .replace(/\n/g, '<br>')       // Convert single newlines to line breaks
            .replace(/📊|🌱|💧|📈|📢|📚|🐛|🌿|💦|🌾|📦/g, '<span class="emoji">$&</span>'); // Style emojis
        
        messageDiv.innerHTML = `<p>${formattedText}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Crop recommendation functionality - only if elements exist
    const cropBtn = document.querySelector('.card:nth-child(1) .btn');
    if (cropBtn) {
        cropBtn.addEventListener('click', function() {
            const soilType = document.getElementById('soilType').value;
            const temperature = document.getElementById('temperature').value;
            const rainfall = document.getElementById('rainfall').value;
            
            fetch(`http://localhost:5000/api/crops?soilType=${soilType}&temperature=${temperature}&rainfall=${rainfall}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const recommendations = data.map(item => `${item.recommended_crop}: ${item.crop_details}`).join('\n');
                        alert(`Recommendations:\n${recommendations}`);
                    } else {
                        alert('No recommendations found for the given conditions.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching recommendations:', error);
                    alert('Error fetching recommendations. Please try again.');
                });
        });
    }

    // Fertilizer recommendation functionality - only if elements exist
    const fertBtn = document.querySelector('.card:nth-child(2) .btn');
    if (fertBtn) {
        fertBtn.addEventListener('click', function() {
            const cropType = document.getElementById('cropType').value;
            const soilType = document.getElementById('soilTypeFert').value;
            const nutrientDeficiency = document.getElementById('nutrientDeficiency').value;
            
            fetch(`http://localhost:5000/api/fertilizers?soilType=${soilType}&cropType=${cropType}&nutrientDeficiency=${nutrientDeficiency}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const recommendations = data.map(item => 
                            `Fertilizer: ${item.fertilizer_type}\nMethod: ${item.application_method}\nDosage: ${item.dosage}\nBenefits: ${item.benefits}\nTiming: ${item.timing}`
                        ).join('\n\n');
                        alert(`Fertilizer Recommendations:\n\n${recommendations}`);
                    } else {
                        alert('No fertilizer recommendations found for the given conditions.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching fertilizer recommendations:', error);
                    alert('Error fetching fertilizer recommendations. Please try again.');
                });
        });
    }
});

// Function to load dashboard statistics from backend
function loadDashboardStats() {
    fetch('http://localhost:5000/api/dashboard/stats')
        .then(response => response.json())
        .then(data => {
            // Update stats cards - find h3 elements within stat-info divs
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 4) {
                statCards[0].querySelector('.stat-info h3').textContent = data.totalCrops || 0;
                statCards[1].querySelector('.stat-info h3').textContent = data.totalFertilizers || 0;
                statCards[2].querySelector('.stat-info h3').textContent = data.totalYieldRecords || 0;
                statCards[3].querySelector('.stat-info h3').textContent = data.totalAlerts || 0;
            }

            // Display recent yields
            displayRecentYields(data.recentYields || []);

            // Load alerts
            loadAlerts();
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            // Keep default values or show error
        });
}

// Function to display recent yield records
function displayRecentYields(yields) {
    const container = document.getElementById('recent-yields');
    
    if (yields.length === 0) {
        container.innerHTML = '<p>No yield records found.</p>';
        return;
    }
    
    const yieldsHtml = yields.map(yield => `
        <div class="yield-item">
            <div class="yield-info">
                <h4>${yield.crop_type}</h4>
                <p>Yield: ${yield.yield_amount} ${yield.yield_unit}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = yieldsHtml;
}

// Function to load and display alerts
function loadAlerts() {
    fetch('http://localhost:5000/api/alerts')
        .then(response => response.json())
        .then(data => {
            displayAlerts(data);
        })
        .catch(error => {
            console.error('Error loading alerts:', error);
        });
}

// Function to display alerts
function displayAlerts(alerts) {
    const container = document.querySelector('.alerts-list');
    
    if (alerts.length === 0) {
        container.innerHTML = '<div class="no-alerts"><i class="fas fa-check-circle"></i><p>No new alerts at this time.</p></div>';
        return;
    }
    
    // Limit to 5 most recent alerts to keep the card manageable
    const recentAlerts = alerts.slice(0, 5);
    
    const alertsHtml = recentAlerts.map(alert => {
        const iconClass = getAlertIcon(alert.type);
        const timeAgo = getTimeAgo(new Date(alert.created_at));
        
        return `
            <div class="alert-item">
                <div class="alert-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                    <span class="alert-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = alertsHtml;
}

// Helper function to get alert icon based on type
function getAlertIcon(type) {
    switch(type) {
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'danger': return 'fas fa-exclamation-circle';
        case 'success': return 'fas fa-check-circle';
        default: return 'fas fa-info-circle';
    }
}

// Helper function to get time ago
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

// Search functionality
function performSearch(query) {
    fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}

function displaySearchResults(results) {
    // For now, just log results. In a full implementation, you'd show them in a dropdown or modal
    console.log('Search results:', results);
    if (results.length > 0) {
        // You could show a dropdown with results here
        alert(`Found ${results.length} results for "${document.getElementById('search-input').value}"`);
    }
}

function clearSearchResults() {
    // Clear any displayed search results
    console.log('Search cleared');
}