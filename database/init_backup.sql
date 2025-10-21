-- Create database
CREATE DATABASE IF NOT EXISTS eco_farm_manager;
USE eco_farm_manager;

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    location VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop recommendations table
CREATE TABLE IF NOT EXISTS croprecommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soil_type VARCHAR(50) NOT NULL,
    temperature DECIMAL(5,2),
    rainfall DECIMAL(5,2),
    recommended_crop VARCHAR(100) NOT NULL,
    crop_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample crop recommendations
INSERT INTO croprecommendations (soil_type, temperature, rainfall, recommended_crop, crop_details) VALUES
('Clay', 25.0, 100.0, 'Rice', 'Rice thrives in clay soil with moderate temperature and rainfall.'),
('Sandy', 30.0, 50.0, 'Maize', 'Maize is suitable for sandy soil with warm temperatures and low rainfall.'),
('Loamy', 28.0, 120.0, 'Wheat', 'Wheat grows well in loamy soil with balanced temperature and rainfall.'),
('Silty', 22.0, 80.0, 'Barley', 'Barley is ideal for silty soil with cooler temperatures.'),
('Clay', 28.0, 150.0, 'Sugarcane', 'Sugarcane prefers clay soil with higher rainfall.'),
('Sandy', 35.0, 30.0, 'Millet', 'Millet is drought-resistant and suits sandy soil.'),
('Loamy', 26.0, 100.0, 'Cotton', 'Cotton requires loamy soil and moderate conditions.'),
('Silty', 24.0, 90.0, 'Oats', 'Oats grow in silty soil with mild temperatures.');

-- Fertilizer recommendations table
CREATE TABLE IF NOT EXISTS fertilizer_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soil_type VARCHAR(50) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    nutrient_deficiency VARCHAR(100),
    fertilizer_type VARCHAR(100) NOT NULL,
    application_method VARCHAR(200),
    dosage VARCHAR(100),
    benefits TEXT,
    timing VARCHAR(100),
    effectiveness INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample fertilizer recommendations
INSERT INTO fertilizer_recommendations (soil_type, crop_type, nutrient_deficiency, fertilizer_type, application_method, dosage, benefits, timing) VALUES
('Clay', 'Rice', 'Nitrogen', 'Urea', 'Broadcast', '50kg/ha', 'Promotes leaf growth', 'Basal application'),
('Sandy', 'Maize', 'Phosphorus', 'DAP', 'Band placement', '100kg/ha', 'Root development', 'At planting'),
('Loamy', 'Wheat', 'Potassium', 'MOP', 'Side dressing', '60kg/ha', 'Grain filling', 'Tillering stage'),
('Silty', 'Barley', 'Nitrogen', 'Ammonium Sulphate', 'Top dressing', '40kg/ha', 'Protein content', 'Stem elongation'),
('Clay', 'Rice', 'Phosphorus', 'SSP', 'Broadcast', '80kg/ha', 'Root development and flowering', 'Basal application'),
('Sandy', 'Maize', 'Nitrogen', 'Urea', 'Side dressing', '75kg/ha', 'Vegetative growth', '30-45 days after planting'),
('Loamy', 'Wheat', 'Nitrogen', 'Urea', 'Split application', '120kg/ha', 'Grain development', 'Crown root initiation and flowering'),
('Silty', 'Barley', 'Phosphorus', 'DAP', 'Placement', '60kg/ha', 'Early root establishment', 'At sowing'),
('Clay', 'Sugarcane', 'Nitrogen', 'Urea', 'Ring method', '150kg/ha', 'Stalk growth', '3-4 months after planting'),
('Sandy', 'Cotton', 'Potassium', 'MOP', 'Foliar spray', '20kg/ha', 'Fiber quality', 'Flowering stage'),
('Loamy', 'Rice', 'Potassium', 'MOP', 'Broadcast', '40kg/ha', 'Disease resistance', 'Panicle initiation'),
('Silty', 'Maize', 'Zinc', 'Zinc Sulphate', 'Soil application', '25kg/ha', 'Enzyme activation', 'At sowing'),
('Clay', 'Wheat', 'Zinc', 'Zinc Sulphate', 'Foliar spray', '2kg/ha', 'Grain filling', 'Milk stage'),
('Sandy', 'Rice', 'Iron', 'Ferrous Sulphate', 'Foliar application', '5kg/ha', 'Chlorophyll formation', '30 days after transplanting'),
('Loamy', 'Sugarcane', 'Calcium', 'Gypsum', 'Soil incorporation', '500kg/ha', 'Soil structure improvement', 'Land preparation'),
('Silty', 'Cotton', 'Magnesium', 'Magnesium Sulphate', 'Foliar spray', '10kg/ha', 'Photosynthesis', 'Vegetative growth stage'),
('Clay', 'Barley', 'Boron', 'Borax', 'Soil application', '2kg/ha', 'Reproductive development', 'At sowing'),
('Sandy', 'Wheat', 'Manganese', 'Manganese Sulphate', 'Foliar spray', '3kg/ha', 'Enzyme activation', 'Tillering stage'),
('Loamy', 'Maize', 'Copper', 'Copper Sulphate', 'Soil application', '5kg/ha', 'Lignin formation', 'At sowing'),
('Silty', 'Rice', 'Molybdenum', 'Sodium Molybdate', 'Seed treatment', '10g/ha', 'Nitrogen fixation', 'Before sowing');

-- Yield records table
CREATE TABLE IF NOT EXISTS yield_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    crop_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    harvest_date DATE,
    yield_amount DECIMAL(10,2),
    yield_unit VARCHAR(20) DEFAULT 'kg/ha',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- Insert sample yield records
INSERT INTO yield_records (farmer_id, crop_type, variety, planting_date, harvest_date, yield_amount, yield_unit, notes) VALUES
(1, 'Rice', 'Basmati', '2024-01-15', '2024-05-15', 4500.00, 'kg/ha', 'Good monsoon season'),
(1, 'Wheat', 'HD 2967', '2023-11-01', '2024-03-15', 3200.00, 'kg/ha', 'Winter crop'),
(2, 'Maize', 'Hybrid', '2024-02-01', '2024-06-01', 6800.00, 'kg/ha', 'High yielding variety'),
(1, 'Rice', 'IR64', '2023-06-15', '2023-10-15', 4200.00, 'kg/ha', 'Kharif season'),
(2, 'Wheat', 'PBW 725', '2023-11-20', '2024-03-30', 3800.00, 'kg/ha', 'Improved irrigation'),
(3, 'Cotton', 'Bt Cotton', '2024-03-01', '2024-09-01', 2200.00, 'kg/ha', 'Pest resistant variety'),
(1, 'Sugarcane', 'Co 86032', '2023-02-15', '2024-02-15', 85000.00, 'kg/ha', 'High sugar content'),
(2, 'Maize', 'Composite', '2023-07-01', '2023-11-01', 5500.00, 'kg/ha', 'Rainfed conditions'),
(3, 'Rice', 'Swarna', '2024-06-20', '2024-10-20', 4800.00, 'kg/ha', 'Drought tolerant');

-- Alerts table (optional)
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample alerts
INSERT INTO alerts (title, message, type, status) VALUES
('Rainfall Alert', 'Heavy rainfall expected in your area in next 48 hours.', 'warning', 'new'),
('Pest Warning', 'Increased locust activity reported in your region.', 'danger', 'new'),
('Planting Season', 'Optimal time for planting wheat is approaching.', 'info', 'new'),
('Fertilizer Reminder', 'Time to apply nitrogen fertilizer for rice crop.', 'info', 'new'),
('Market Price Update', 'Wheat prices have increased by 15% in local market.', 'success', 'new'),
('Weather Advisory', 'Temperature expected to drop below 10°C next week.', 'warning', 'new'),
('Irrigation Alert', 'Check irrigation systems - water levels are low.', 'danger', 'new'),
('Crop Disease Alert', 'Blight disease reported in nearby tomato fields.', 'danger', 'new'),
('Harvest Reminder', 'Rice harvest season begins next month.', 'info', 'new'),
('Soil Testing', 'Schedule soil testing for next cropping season.', 'info', 'new');

-- Knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (title, content, category, tags) VALUES
('Rice Cultivation Guide', 'Rice requires clay or loamy soil with pH 5.5-6.5. Optimal temperature: 20-35°C. Water requirement: 1200-1500mm. Planting season: June-July (Kharif) or December-January (Rabi).', 'Crops', 'rice,cultivation,guide,soil,temperature,water'),
('Wheat Farming Tips', 'Wheat grows best in loamy soil with good drainage. Optimal temperature: 15-20°C during growth, 20-25°C during grain filling. Requires 450-650mm rainfall. Plant in November-December for Rabi season.', 'Crops', 'wheat,farming,tips,soil,temperature,rainfall'),
('Maize Production', 'Maize thrives in well-drained loamy soil. Temperature range: 20-30°C. Requires 500-800mm rainfall. Plant spacing: 60x25cm. Harvest when kernels are hard and milky layer disappears.', 'Crops', 'maize,production,soil,temperature,rainfall'),
('Fertilizer Application Guide', 'Apply nitrogen fertilizers in split doses - 50% basal, 25% at tillering, 25% at panicle initiation. Phosphorus should be applied at planting. Potassium helps in grain filling and disease resistance.', 'Fertilizers', 'fertilizer,application,nitrogen,phosphorus,potassium'),
('Pest Management in Rice', 'Common pests: Stem borer, leaf folder, brown plant hopper. Use integrated pest management: cultural, biological, and chemical controls. Apply neem oil spray for minor infestations.', 'Pests', 'pest,management,rice,stem borer,leaf folder,neem oil'),
('Soil Health Management', 'Maintain soil pH between 6.0-7.0. Add organic matter annually. Test soil every 2-3 years. Use crop rotation to prevent nutrient depletion and pest buildup.', 'Soil', 'soil,health,ph,organic matter,crop rotation'),
('Irrigation Techniques', 'Rice: Flood irrigation. Wheat: Furrow irrigation. Maize: Drip irrigation for water efficiency. Irrigate when soil moisture reaches 50% depletion. Avoid waterlogging.', 'Irrigation', 'irrigation,techniques,rice,wheat,maize,drip,furrow'),
('Climate Change Adaptation', 'Choose drought-resistant varieties. Implement conservation agriculture. Use mulching to retain soil moisture. Diversify crops to reduce risk.', 'Climate', 'climate,change,adaptation,drought,resistant,varieties'),
('Organic Farming Practices', 'Use compost and vermiculture for nutrients. Practice crop rotation and intercropping. Avoid chemical pesticides. Use bio-fertilizers like Rhizobium for legumes.', 'Organic', 'organic,farming,practices,compost,crop rotation,biofertilizers'),
('Post-Harvest Management', 'Dry grains to 12-14% moisture content. Store in clean, dry bins. Use proper packaging to prevent pest infestation. Sort and grade before storage.', 'Post-Harvest', 'post,harvest,management,drying,storage,packaging');

-- Crop calendar table
CREATE TABLE IF NOT EXISTS crop_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150),
    planting_season VARCHAR(100) NOT NULL,
    harvesting_season VARCHAR(100) NOT NULL,
    duration_days INT,
    soil_type VARCHAR(100),
    temperature_range VARCHAR(50),
    rainfall_requirement VARCHAR(100),
    key_activities TEXT,
    optimal_conditions TEXT,
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample crop calendar data
INSERT INTO crop_calendar (crop_name, scientific_name, planting_season, harvesting_season, duration_days, soil_type, temperature_range, rainfall_requirement, key_activities, optimal_conditions, region) VALUES
('Rice', 'Oryza sativa', 'June-July (Kharif), December-January (Rabi)', 'October-November (Kharif), April-May (Rabi)', 120, 'Clay/Loamy', '20-35°C', '1200-1500mm', 'Land preparation, nursery raising, transplanting, weeding, fertilization, pest control, harvesting', 'Flooded fields, warm and humid climate, pH 5.5-6.5', 'India, Southeast Asia'),
('Wheat', 'Triticum aestivum', 'October-November (Rabi), March-April (Summer)', 'March-April (Rabi), June-July (Summer)', 120, 'Loamy', '15-20°C', '450-650mm', 'Seed bed preparation, sowing, irrigation, fertilization, pest control, harvesting', 'Well-drained soil, cool climate during growth, warm during grain filling', 'North India, Temperate regions'),
('Maize', 'Zea mays', 'June-July (Kharif), February-March (Rabi)', 'September-October (Kharif), May-June (Rabi)', 90, 'Well-drained Loamy', '20-30°C', '500-800mm', 'Land preparation, sowing, thinning, fertilization, irrigation, pest control, harvesting', 'Sunny weather, adequate moisture, pH 6.0-7.0', 'All India, Tropical/Subtropical'),
('Cotton', 'Gossypium spp.', 'April-May (Kharif), August-September (Summer)', 'November-December (Kharif), January-February (Summer)', 150, 'Black/Red soil', '25-35°C', '600-1000mm', 'Seed treatment, sowing, thinning, fertilization, pest management, defoliation, harvesting', 'Warm climate, well-drained soil, adequate sunlight', 'Maharashtra, Gujarat, Andhra Pradesh'),
('Sugarcane', 'Saccharum officinarum', 'February-March (Spring), September-October (Autumn)', 'December-March (Spring), July-November (Autumn)', 300, 'Deep fertile soil', '20-35°C', '1500-2500mm', 'Land preparation, sett treatment, planting, earthing up, fertilization, irrigation, harvesting', 'Fertile soil, adequate water, tropical climate', 'Uttar Pradesh, Maharashtra, Karnataka'),
('Potatoes', 'Solanum tuberosum', 'September-October (Autumn), January-February (Spring)', 'January-February (Autumn), April-May (Spring)', 90, 'Sandy Loam', '15-20°C', '500-700mm', 'Seed treatment, ridge making, planting, earthing up, fertilization, irrigation, harvesting', 'Cool climate, loose soil, adequate moisture', 'Hills of North India, West Bengal'),
('Tomatoes', 'Solanum lycopersicum', 'June-July (Kharif), December-January (Rabi)', 'October-November (Kharif), March-April (Rabi)', 120, 'Well-drained Loamy', '20-25°C', '600-800mm', 'Nursery raising, transplanting, staking, fertilization, pest control, harvesting', 'Warm climate, well-drained soil, full sunlight', 'All India, Protected cultivation'),
('Onions', 'Allium cepa', 'September-October (Kharif), January-February (Rabi)', 'January-February (Kharif), April-May (Rabi)', 120, 'Fertile Loamy', '15-25°C', '400-600mm', 'Seed treatment, sowing/transplanting, thinning, fertilization, irrigation, harvesting', 'Mild climate, fertile soil, good drainage', 'Maharashtra, Karnataka, Tamil Nadu'),
('Chillies', 'Capsicum annuum', 'January-February (Rabi), June-July (Kharif)', 'April-May (Rabi), September-October (Kharif)', 150, 'Well-drained Loamy', '20-30°C', '600-800mm', 'Nursery raising, transplanting, fertilization, pest control, harvesting', 'Warm climate, adequate moisture, full sunlight', 'Andhra Pradesh, Karnataka, West Bengal'),
('Groundnut', 'Arachis hypogaea', 'June-July (Kharif), January-February (Rabi)', 'September-October (Kharif), April-May (Rabi)', 120, 'Sandy Loam', '25-30°C', '500-700mm', 'Seed treatment, sowing, fertilization, weed control, pest management, harvesting', 'Warm climate, well-drained sandy soil', 'Gujarat, Andhra Pradesh, Tamil Nadu'),
('Soybean', 'Glycine max', 'June-July (Kharif), February-March (Spring)', 'October-November (Kharif), May-June (Spring)', 100, 'Well-drained Loamy', '20-30°C', '600-800mm', 'Seed treatment, sowing, fertilization, irrigation, pest control, harvesting', 'Warm humid climate, well-drained soil', 'Madhya Pradesh, Maharashtra, Rajasthan'),
('Turmeric', 'Curcuma longa', 'April-May (Summer), August-September (Kharif)', 'January-March (Summer), January-March (Kharif)', 240, 'Rich Loamy', '20-30°C', '1500-2000mm', 'Rhizome treatment, planting, mulching, fertilization, irrigation, harvesting', 'Humid climate, partial shade, rich organic soil', 'Andhra Pradesh, Odisha, West Bengal'),
('Ginger', 'Zingiber officinale', 'March-April (Summer), August-September (Kharif)', 'December-February (Summer), December-February (Kharif)', 240, 'Rich Loamy', '20-30°C', '1500-2000mm', 'Rhizome treatment, planting, mulching, fertilization, irrigation, harvesting', 'Humid climate, partial shade, rich organic soil', 'Kerala, Karnataka, West Bengal');

-- Crops table (for admin management)
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    planting_date DATE,
    harvesting_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample crops
INSERT INTO crops (name, planting_date, harvesting_date, description) VALUES
('Rice', '2024-06-15', '2024-10-15', 'Main Kharif crop, requires flooded fields'),
('Wheat', '2024-11-01', '2024-03-15', 'Winter crop, Rabi season'),
('Maize', '2024-06-20', '2024-09-20', 'Summer crop, high yield potential'),
('Cotton', '2024-05-01', '2024-12-01', 'Cash crop, long duration');

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category) VALUES
('What is the best time to plant rice?', 'Rice is typically planted during the Kharif season (June-July) when monsoon rains begin, or during Rabi season (December-January) in irrigated areas.', 'Planting'),
('How much water does rice need?', 'Rice requires continuous flooding with 5-10 cm of water during the growing season, totaling about 1200-1500mm of water throughout the crop cycle.', 'Irrigation'),
('What fertilizers should I use for wheat?', 'Wheat requires nitrogen, phosphorus, and potassium (NPK). Apply 120-150 kg N/ha, 60-80 kg P2O5/ha, and 40-50 kg K2O/ha in split doses.', 'Fertilizers'),
('How do I control pests in maize?', 'Use integrated pest management: crop rotation, resistant varieties, biological control, and targeted chemical pesticides only when necessary.', 'Pest Control'),
('What soil pH is best for most crops?', 'Most crops prefer soil pH between 6.0-7.0. Test your soil pH regularly and amend with lime (to increase pH) or sulfur (to decrease pH) as needed.', 'Soil Management');

-- Farmers table (add more sample data)

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

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO admin (username, password, email, role) VALUES
('admin', '$2b$10$8K3VzJcQX8zJcQX8zJcQX8zJcQX8zJcQX8zJcQX8zJcQX8zJcQX8', 'admin@ecofarm.com', 'admin');

-- Chatbot table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    farmer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE SET NULL
);

-- Insert sample chatbot conversations
INSERT INTO chatbot_conversations (session_id, user_message, bot_response, farmer_id) VALUES
('session_001', 'What crops should I plant in clay soil?', 'For clay soil, rice is an excellent choice as it thrives in waterlogged conditions. You can also consider sugarcane which does well in clay soil with adequate irrigation.', 1),
('session_002', 'How do I control pests in my maize field?', 'For maize pest control, use integrated pest management: crop rotation, resistant varieties, and targeted chemical pesticides. Neem oil spray works well for minor infestations.', 2),
('session_003', 'When should I apply fertilizer to wheat?', 'Apply nitrogen fertilizers in split doses: 50% basal at sowing, 25% at tillering stage, and 25% at flowering. Phosphorus should be applied entirely at planting.', 1);
