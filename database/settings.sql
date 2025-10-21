-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'email') DEFAULT 'text',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_setting (category, setting_key)
);

-- Insert default settings
INSERT INTO settings (category, setting_key, setting_value, setting_type, description) VALUES
('general', 'site_name', 'Eco-Farm Manager', 'text', 'Name of the application'),
('general', 'site_description', 'Comprehensive farming management system', 'text', 'Brief description of the application'),
('contact', 'support_email', 'support@ecofarm.com', 'email', 'Support email address'),
('contact', 'admin_email', 'admin@ecofarm.com', 'email', 'Administrator email address'),
('system', 'maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('system', 'debug_mode', 'false', 'boolean', 'Enable debug logging'),
('notifications', 'email_notifications', 'true', 'boolean', 'Enable email notifications'),
('notifications', 'sms_notifications', 'false', 'boolean', 'Enable SMS notifications'),
('limits', 'max_file_size', '10', 'number', 'Maximum file upload size in MB'),
('limits', 'max_users', '1000', 'number', 'Maximum number of registered users');
