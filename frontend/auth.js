// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}Form`).classList.add('active');
        });
    });
    
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
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
    });
    
    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('loginPhone').value;
            const password = document.getElementById('loginPassword').value;
            
            // Basic validation
            if (!phone || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Phone validation
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Simulate login process
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const phone = document.getElementById('regPhone').value;
            const location = document.getElementById('regLocation').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Basic validation
            if (!name || !phone || !location || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            // Phone validation
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Password validation
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            // Password confirmation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Terms agreement
            if (!agreeTerms) {
                alert('Please agree to the Terms & Conditions');
                return;
            }
            
            // Simulate registration process
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Registration successful! You can now login with your credentials.');
                
                // Switch to login tab
                tabBtns.forEach(btn => btn.classList.remove('active'));
                document.querySelector('[data-tab="login"]').classList.add('active');
                
                authForms.forEach(form => form.classList.remove('active'));
                document.getElementById('loginForm').classList.add('active');
                
                // Pre-fill login form
                document.getElementById('loginPhone').value = phone;
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Reset registration form
                registerForm.reset();
            }, 1500);
        });
    }
});