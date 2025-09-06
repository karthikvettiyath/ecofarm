
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
