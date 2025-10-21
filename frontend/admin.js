
// Admin authentication and routing logic
document.addEventListener('DOMContentLoaded', function() {
	// Toggle password visibility
	const togglePasswordBtn = document.getElementById('toggleAdminPassword');
	if (togglePasswordBtn) {
		togglePasswordBtn.addEventListener('click', function() {
			const input = document.getElementById('adminPassword');
			const icon = this.querySelector('i');
			if (input.type === 'password') {
				input.type = 'text';
				icon.classList.remove('fa-eye');
				icon.classList.add('fa-eye-slash');
			} else {
				input.type = 'password';
				icon.classList.remove('fa-eye-slash');
				icon.classList.add('fa-eye');
			}
		});
	}

	// Admin login form logic
	const adminLoginForm = document.getElementById('adminLoginForm');
	if (adminLoginForm) {
		adminLoginForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const username = document.getElementById('adminUsername').value;
			const password = document.getElementById('adminPassword').value;
			// Default credentials
			const defaultUsername = 'admin';
			const defaultPassword = 'admin123';
			if (username === defaultUsername && password === defaultPassword) {
				// Store session
				sessionStorage.setItem('isAdmin', 'true');
				window.location.href = 'admin-dashboard.html';
			} else {
				alert('Invalid admin credentials');
			}
		});
	}

	// Restrict access to admin pages
	const adminPages = [
		'admin-dashboard.html',
		'admin-users.html',
		'admin-content.html',
		'admin-analytics.html'
	];
	const currentPage = window.location.pathname.split('/').pop();
	if (adminPages.includes(currentPage)) {
		if (sessionStorage.getItem('isAdmin') !== 'true') {
			window.location.href = 'admin-login.html';
		}
	}

	// Logout function for admin pages
	const logoutBtn = document.querySelector('.logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', function(e) {
			e.preventDefault();
			sessionStorage.removeItem('isAdmin');
			window.location.href = 'admin-login.html';
		});
	}
});

// ==================== ADMIN CONTENT MANAGEMENT ====================

// Admin API helper functions
const adminAPI = {
	headers: {
		'Content-Type': 'application/json',
		'x-admin-auth': 'true' // Simple admin auth for now
	},

	async get(endpoint) {
		const response = await fetch(`http://localhost:5000${endpoint}`, {
			headers: this.headers
		});
		return response.json();
	},

	async post(endpoint, data) {
		const response = await fetch(`http://localhost:5000${endpoint}`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(data)
		});
		return response.json();
	},

	async put(endpoint, data) {
		const response = await fetch(`http://localhost:5000${endpoint}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify(data)
		});
		return response.json();
	},

	async delete(endpoint) {
		const response = await fetch(`http://localhost:5000${endpoint}`, {
			method: 'DELETE',
			headers: this.headers
		});
		return response.json();
	}
};

// ==================== FAQS MANAGEMENT ====================

class FAQManager {
	constructor() {
		this.faqs = [];
		this.currentEditId = null;
		this.init();
	}

	init() {
		this.loadFAQs();
		this.bindEvents();
	}

	bindEvents() {
		// Add FAQ button
		const addBtn = document.getElementById('addFAQBtn');
		if (addBtn) {
			addBtn.addEventListener('click', () => this.showAddForm());
		}

		// FAQ form
		const form = document.getElementById('faqForm');
		if (form) {
			form.addEventListener('submit', (e) => this.handleFormSubmit(e));
		}

		// Cancel button
		const cancelBtn = document.getElementById('cancelFAQBtn');
		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => this.hideForm());
		}
	}

	async loadFAQs() {
		try {
			this.faqs = await adminAPI.get('/api/admin/faqs');
			this.renderFAQs();
		} catch (error) {
			console.error('Error loading FAQs:', error);
			this.showMessage('Error loading FAQs', 'error');
		}
	}

	renderFAQs() {
		const container = document.getElementById('faqsList');
		if (!container) return;

		container.innerHTML = this.faqs.map(faq => `
			<div class="content-item">
				<div class="content-header">
					<h4>${faq.question}</h4>
					<div class="content-actions">
						<span class="status-badge status-${faq.status}">${faq.status}</span>
						<button class="btn btn-sm btn-primary" onclick="faqManager.editFAQ(${faq.id})">
							<i class="fas fa-edit"></i> Edit
						</button>
						<button class="btn btn-sm btn-danger" onclick="faqManager.deleteFAQ(${faq.id})">
							<i class="fas fa-trash"></i> Delete
						</button>
					</div>
				</div>
				<div class="content-body">
					<p><strong>Answer:</strong> ${faq.answer}</p>
					<p><strong>Category:</strong> ${faq.category}</p>
					<p><strong>Created:</strong> ${new Date(faq.created_at).toLocaleDateString()}</p>
				</div>
			</div>
		`).join('');
	}

	showAddForm() {
		this.currentEditId = null;
		document.getElementById('faqFormTitle').textContent = 'Add New FAQ';
		document.getElementById('faqForm').reset();
		document.getElementById('faqFormContainer').style.display = 'block';
	}

	editFAQ(id) {
		const faq = this.faqs.find(f => f.id === id);
		if (!faq) return;

		this.currentEditId = id;
		document.getElementById('faqFormTitle').textContent = 'Edit FAQ';
		document.getElementById('faqQuestion').value = faq.question;
		document.getElementById('faqAnswer').value = faq.answer;
		document.getElementById('faqCategory').value = faq.category;
		document.getElementById('faqStatus').value = faq.status;
		document.getElementById('faqFormContainer').style.display = 'block';
	}

	hideForm() {
		document.getElementById('faqFormContainer').style.display = 'none';
		this.currentEditId = null;
	}

	async handleFormSubmit(e) {
		e.preventDefault();

		const data = {
			question: document.getElementById('faqQuestion').value,
			answer: document.getElementById('faqAnswer').value,
			category: document.getElementById('faqCategory').value,
			status: document.getElementById('faqStatus').value
		};

		try {
			if (this.currentEditId) {
				await adminAPI.put(`/api/admin/faqs/${this.currentEditId}`, data);
				this.showMessage('FAQ updated successfully!', 'success');
			} else {
				await adminAPI.post('/api/admin/faqs', data);
				this.showMessage('FAQ added successfully!', 'success');
			}
			this.hideForm();
			this.loadFAQs();
		} catch (error) {
			console.error('Error saving FAQ:', error);
			this.showMessage('Error saving FAQ', 'error');
		}
	}

	async deleteFAQ(id) {
		if (!confirm('Are you sure you want to delete this FAQ?')) return;

		try {
			await adminAPI.delete(`/api/admin/faqs/${id}`);
			this.showMessage('FAQ deleted successfully!', 'success');
			this.loadFAQs();
		} catch (error) {
			console.error('Error deleting FAQ:', error);
			this.showMessage('Error deleting FAQ', 'error');
		}
	}

	showMessage(message, type) {
		// Simple message display - you can enhance this
		alert(message);
	}
}

// ==================== ALERTS MANAGEMENT ====================

class AlertManager {
	constructor() {
		this.alerts = [];
		this.currentEditId = null;
		this.init();
	}

	init() {
		this.loadAlerts();
		this.bindEvents();
	}

	bindEvents() {
		// Add Alert button
		const addBtn = document.getElementById('addAlertBtn');
		if (addBtn) {
			addBtn.addEventListener('click', () => this.showAddForm());
		}

		// Alert form
		const form = document.getElementById('alertForm');
		if (form) {
			form.addEventListener('submit', (e) => this.handleFormSubmit(e));
		}

		// Cancel button
		const cancelBtn = document.getElementById('cancelAlertBtn');
		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => this.hideForm());
		}
	}

	async loadAlerts() {
		try {
			this.alerts = await adminAPI.get('/api/admin/alerts');
			this.renderAlerts();
		} catch (error) {
			console.error('Error loading alerts:', error);
			this.showMessage('Error loading alerts', 'error');
		}
	}

	renderAlerts() {
		const container = document.getElementById('alertsList');
		if (!container) return;

		container.innerHTML = this.alerts.map(alert => `
			<div class="content-item">
				<div class="content-header">
					<h4>${alert.title}</h4>
					<div class="content-actions">
						<span class="status-badge status-${alert.status}">${alert.status}</span>
						<span class="type-badge type-${alert.type}">${alert.type}</span>
						<button class="btn btn-sm btn-primary" onclick="alertManager.editAlert(${alert.id})">
							<i class="fas fa-edit"></i> Edit
						</button>
						<button class="btn btn-sm btn-danger" onclick="alertManager.deleteAlert(${alert.id})">
							<i class="fas fa-trash"></i> Delete
						</button>
					</div>
				</div>
				<div class="content-body">
					<p><strong>Message:</strong> ${alert.message}</p>
					<p><strong>Created:</strong> ${new Date(alert.created_at).toLocaleDateString()}</p>
				</div>
			</div>
		`).join('');
	}

	showAddForm() {
		this.currentEditId = null;
		document.getElementById('alertFormTitle').textContent = 'Add New Alert';
		document.getElementById('alertForm').reset();
		document.getElementById('alertFormContainer').style.display = 'block';
	}

	editAlert(id) {
		const alert = this.alerts.find(a => a.id === id);
		if (!alert) return;

		this.currentEditId = id;
		document.getElementById('alertFormTitle').textContent = 'Edit Alert';
		document.getElementById('alertTitle').value = alert.title;
		document.getElementById('alertMessage').value = alert.message;
		document.getElementById('alertType').value = alert.type;
		document.getElementById('alertStatus').value = alert.status;
		document.getElementById('alertFormContainer').style.display = 'block';
	}

	hideForm() {
		document.getElementById('alertFormContainer').style.display = 'none';
		this.currentEditId = null;
	}

	async handleFormSubmit(e) {
		e.preventDefault();

		const data = {
			title: document.getElementById('alertTitle').value,
			message: document.getElementById('alertMessage').value,
			type: document.getElementById('alertType').value,
			status: document.getElementById('alertStatus').value
		};

		try {
			if (this.currentEditId) {
				await adminAPI.put(`/api/admin/alerts/${this.currentEditId}`, data);
				this.showMessage('Alert updated successfully!', 'success');
			} else {
				await adminAPI.post('/api/admin/alerts', data);
				this.showMessage('Alert added successfully!', 'success');
			}
			this.hideForm();
			this.loadAlerts();
		} catch (error) {
			console.error('Error saving alert:', error);
			this.showMessage('Error saving alert', 'error');
		}
	}

	async deleteAlert(id) {
		if (!confirm('Are you sure you want to delete this alert?')) return;

		try {
			await adminAPI.delete(`/api/admin/alerts/${id}`);
			this.showMessage('Alert deleted successfully!', 'success');
			this.loadAlerts();
		} catch (error) {
			console.error('Error deleting alert:', error);
			this.showMessage('Error deleting alert', 'error');
		}
	}

	showMessage(message, type) {
		alert(message);
	}
}

// ==================== CROP CALENDAR MANAGEMENT ====================

class CropCalendarManager {
	constructor() {
		this.crops = [];
		this.currentEditId = null;
		this.init();
	}

	init() {
		this.loadCrops();
		this.bindEvents();
	}

	bindEvents() {
		// Add Crop button
		const addBtn = document.getElementById('addCropBtn');
		if (addBtn) {
			addBtn.addEventListener('click', () => this.showAddForm());
		}

		// Crop form
		const form = document.getElementById('cropForm');
		if (form) {
			form.addEventListener('submit', (e) => this.handleFormSubmit(e));
		}

		// Cancel button
		const cancelBtn = document.getElementById('cancelCropBtn');
		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => this.hideForm());
		}
	}

	async loadCrops() {
		try {
			this.crops = await adminAPI.get('/api/admin/crop-calendar');
			this.renderCrops();
		} catch (error) {
			console.error('Error loading crop calendar:', error);
			this.showMessage('Error loading crop calendar', 'error');
		}
	}

	renderCrops() {
		const container = document.getElementById('cropCalendarList');
		if (!container) return;

		container.innerHTML = this.crops.map(crop => `
			<div class="content-item">
				<div class="content-header">
					<h4>${crop.crop_name}</h4>
					<div class="content-actions">
						<button class="btn btn-sm btn-primary" onclick="cropManager.editCrop(${crop.id})">
							<i class="fas fa-edit"></i> Edit
						</button>
						<button class="btn btn-sm btn-danger" onclick="cropManager.deleteCrop(${crop.id})">
							<i class="fas fa-trash"></i> Delete
						</button>
					</div>
				</div>
				<div class="content-body">
					<p><strong>Scientific Name:</strong> ${crop.scientific_name || 'N/A'}</p>
					<p><strong>Planting Season:</strong> ${crop.planting_season}</p>
					<p><strong>Harvesting Season:</strong> ${crop.harvesting_season}</p>
					<p><strong>Duration:</strong> ${crop.duration_days || 'N/A'} days</p>
					<p><strong>Soil Type:</strong> ${crop.soil_type || 'N/A'}</p>
					<p><strong>Temperature Range:</strong> ${crop.temperature_range || 'N/A'}</p>
					<p><strong>Rainfall Requirement:</strong> ${crop.rainfall_requirement || 'N/A'}</p>
					<p><strong>Region:</strong> ${crop.region || 'N/A'}</p>
					<p><strong>Key Activities:</strong> ${crop.key_activities || 'N/A'}</p>
					<p><strong>Optimal Conditions:</strong> ${crop.optimal_conditions || 'N/A'}</p>
				</div>
			</div>
		`).join('');
	}

	showAddForm() {
		this.currentEditId = null;
		document.getElementById('cropFormTitle').textContent = 'Add New Crop';
		document.getElementById('cropForm').reset();
		document.getElementById('cropFormContainer').style.display = 'block';
	}

	editCrop(id) {
		const crop = this.crops.find(c => c.id === id);
		if (!crop) return;

		this.currentEditId = id;
		document.getElementById('cropFormTitle').textContent = 'Edit Crop';
		document.getElementById('cropName').value = crop.crop_name;
		document.getElementById('scientificName').value = crop.scientific_name || '';
		document.getElementById('plantingSeason').value = crop.planting_season;
		document.getElementById('harvestingSeason').value = crop.harvesting_season;
		document.getElementById('durationDays').value = crop.duration_days || '';
		document.getElementById('soilType').value = crop.soil_type || '';
		document.getElementById('temperatureRange').value = crop.temperature_range || '';
		document.getElementById('rainfallRequirement').value = crop.rainfall_requirement || '';
		document.getElementById('keyActivities').value = crop.key_activities || '';
		document.getElementById('optimalConditions').value = crop.optimal_conditions || '';
		document.getElementById('region').value = crop.region || '';
		document.getElementById('cropFormContainer').style.display = 'block';
	}

	hideForm() {
		document.getElementById('cropFormContainer').style.display = 'none';
		this.currentEditId = null;
	}

	async handleFormSubmit(e) {
		e.preventDefault();

		const data = {
			crop_name: document.getElementById('cropName').value,
			scientific_name: document.getElementById('scientificName').value,
			planting_season: document.getElementById('plantingSeason').value,
			harvesting_season: document.getElementById('harvestingSeason').value,
			duration_days: document.getElementById('durationDays').value,
			soil_type: document.getElementById('soilType').value,
			temperature_range: document.getElementById('temperatureRange').value,
			rainfall_requirement: document.getElementById('rainfallRequirement').value,
			key_activities: document.getElementById('keyActivities').value,
			optimal_conditions: document.getElementById('optimalConditions').value,
			region: document.getElementById('region').value
		};

		try {
			if (this.currentEditId) {
				await adminAPI.put(`/api/admin/crop-calendar/${this.currentEditId}`, data);
				this.showMessage('Crop updated successfully!', 'success');
			} else {
				await adminAPI.post('/api/admin/crop-calendar', data);
				this.showMessage('Crop added successfully!', 'success');
			}
			this.hideForm();
			this.loadCrops();
		} catch (error) {
			console.error('Error saving crop:', error);
			this.showMessage('Error saving crop', 'error');
		}
	}

	async deleteCrop(id) {
		if (!confirm('Are you sure you want to delete this crop?')) return;

		try {
			await adminAPI.delete(`/api/admin/crop-calendar/${id}`);
			this.showMessage('Crop deleted successfully!', 'success');
			this.loadCrops();
		} catch (error) {
			console.error('Error deleting crop:', error);
			this.showMessage('Error deleting crop', 'error');
		}
	}

	showMessage(message, type) {
		alert(message);
	}
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	// Initialize managers only if we're on the admin content page
	if (document.getElementById('faqsList')) {
		window.faqManager = new FAQManager();
	}
	if (document.getElementById('alertsList')) {
		window.alertManager = new AlertManager();
	}
	if (document.getElementById('cropCalendarList')) {
		window.cropManager = new CropCalendarManager();
	}

	// Tab switching functionality
	const tabBtns = document.querySelectorAll('.tab-btn');
	const tabContents = document.querySelectorAll('.tab-content');

	tabBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			// Remove active class from all tabs
			tabBtns.forEach(b => b.classList.remove('active'));
			tabContents.forEach(c => c.classList.remove('active'));

			// Add active class to clicked tab
			btn.classList.add('active');
			const tabId = btn.getAttribute('data-tab');
			const targetContent = document.getElementById(tabId);
			if (targetContent) {
				targetContent.classList.add('active');
			}
		});
	});
});

// ==================== SEARCH FUNCTIONALITY ====================


// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
// Initialize managers only if we're on the admin content page
if (document.getElementById('faqsList')) {
window.faqManager = new FAQManager();
}
if (document.getElementById('alertsList')) {
window.alertManager = new AlertManager();
}
if (document.getElementById('cropCalendarList')) {
window.cropManager = new CropCalendarManager();
}
});
