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
    farmer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
);

-- Fertilizer recommendations table
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

-- Yield records table
CREATE TABLE yieldrecords (
    yield_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT,
    crop VARCHAR(100) NOT NULL,
    yield_quantity FLOAT NOT NULL,
    season VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP