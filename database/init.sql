CREATE DATABASE IF NOT EXISTS eco_farm_manager;
USE eco_farm_manager;

-- Farmers table
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    location VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop recommendations table
CREATE TABLE croprecommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soil_type VARCHAR(50) NOT NULL,
    temperature FLOAT NOT NULL,
    rainfall FLOAT NOT NULL,
    recommended_crop VARCHAR(100) NOT NULL,
    crop_details TEXT,
    farmer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
);

CREATE TABLE fertilizerrecommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop VARCHAR(100) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    fertilizer_type VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    farmer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
);

-- Add more soil types
-- Add more crop recommendations with details
INSERT INTO croprecommendations (soil_type, temperature, rainfall, recommended_crop, crop_details)
VALUES
('clay', 25, 800, 'Rice', 'Rice grows well in clay soil with high water retention. Suitable for regions with heavy rainfall.'),
('clay', 26, 850, 'Paddy', 'Paddy is ideal for clay soil and requires abundant water.'),
('sandy', 30, 400, 'Groundnut', 'Groundnut prefers sandy soil and moderate rainfall. Drought-resistant and suitable for dry climates.'),
('sandy', 32, 350, 'Watermelon', 'Watermelon thrives in sandy soil and warm temperatures.'),
('loamy', 22, 600, 'Wheat', 'Wheat thrives in loamy soil with balanced nutrients and moderate rainfall.'),
('loamy', 24, 650, 'Tomato', 'Tomato prefers loamy soil and moderate rainfall.'),
('silty', 20, 700, 'Sugarcane', 'Sugarcane grows best in silty soil with good moisture and high rainfall.'),
('silty', 21, 750, 'Pea', 'Pea is suitable for silty soil and cool climates.'),
('peaty', 18, 900, 'Potato', 'Potato prefers peaty soil rich in organic matter and cool temperatures.'),
('peaty', 19, 950, 'Carrot', 'Carrot grows well in peaty soil and requires good drainage.'),
('chalky', 24, 500, 'Barley', 'Barley is suitable for chalky soil with good drainage and moderate rainfall.'),
('chalky', 25, 550, 'Cabbage', 'Cabbage prefers chalky soil and cool temperatures.'),
('saline', 28, 350, 'Cotton', 'Cotton can tolerate saline soil and requires warm temperatures.'),
('saline', 29, 370, 'Beetroot', 'Beetroot can grow in saline soil and moderate rainfall.'),
('red', 26, 650, 'Millet', 'Millet is ideal for red soil and semi-arid regions.'),
('red', 27, 700, 'Sorghum', 'Sorghum grows well in red soil and is drought-resistant.'),
('black', 27, 700, 'Soybean', 'Soybean grows well in black soil with high fertility and good moisture.'),
('black', 28, 750, 'Cotton', 'Cotton also grows well in black soil with warm temperatures.'),
('black', 25, 800, 'Sunflower', 'Sunflower prefers black soil and moderate rainfall.');

-- Yield records table
CREATE TABLE yieldrecords (
    yield_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    crop VARCHAR(100) NOT NULL,
    yield_quantity FLOAT NOT NULL,
    season VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP