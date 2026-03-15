-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image TEXT,
    description TEXT
);

-- Seed Initial Products
INSERT INTO products (name, price, category, image, description)
VALUES 
('Ethiopian Yirgacheffe', 18.90, 'Light Roast', 'assets/coffee-product-1.jpg', 'Bright, floral coffee with notes of jasmine and lemon.'),
('Espresso Mandheling', 19.00, 'Medium Roast', 'assets/coffee-product-3.jpg', 'Full-bodied and earthy with low acidity.'),
('Colombian Supremo', 16.50, 'Dark Roast', 'assets/coffee-product-2.jpg', 'Balanced and smooth with a nutty sweetness and caramel finish.'),
('Sumatra Blend', 20.00, 'Dark Roast', 'assets/coffee-product-4.jpg', 'Rich crema and intense flavor. Perfect for espresso machines.')
ON CONFLICT DO NOTHING;
