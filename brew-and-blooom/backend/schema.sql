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

-- Seed Initial Products (Using INSERT INTO ... SELECT for robust seeding)
INSERT INTO products (name, price, category, image, description)
SELECT 'Luna Yirgacheffe', 18.90, 'Light Roast', 'assets/coffee-w2.jpg', 'Bright, floral coffee with notes of jasmine and lemon.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ethiopian Yirgacheffe');

INSERT INTO products (name, price, category, image, description)
SELECT 'Espresso Mandheling', 19.00, 'Medium Roast', 'assets/coffee-w3.jpg', 'Full-bodied and earthy with low acidity.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Simple Espresso Mandheling');

INSERT INTO products (name, price, category, image, description)
SELECT 'Sun-Drenched Sidamo', 22.00, 'DARK Roast', 'assets/coffee-w9.jpg', 'Authentic Ethiopian heirloom with complex jasmine and tea-like notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sun-Drenched Sidamo');


INSERT INTO products (name, price, category, image, description)
SELECT 'Sumatra Blend ', 10.00, 'Dark Roast', 'assets/coffee-w1.jpg', 'Rich crema and intense flavored Coffee.' 
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sumatra Blend');

INSERT INTO products (name, price, category, image, description)
<<<<<<< HEAD
SELECT 'Morning Dew Arabica', 14.90, 'Medium Roast', 'assets/coffee-product-5.jpg', 'Bright and crisp with a citrus zest and honeyed finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Morning Dew Arabica');

INSERT INTO products (name, price, category, image, description)
SELECT 'Sun-Drenched Sidamo', 22.00, 'DARK Roast', 'assets/coffee-product-6.jpg', 'Authentic Ethiopian heirloom with complex jasmine and tea-like notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sun-Drenched Sidamo');

   
INSERT INTO products (name, price, category, image, description)
SELECT 'Roasted Orchid', 17.50, 'Medium-Dark', 'assets/coffee-product-9.jpg', 'A bold, aromatic blend featuring spicy undertones and a silky finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roasted Orchid');

INSERT INTO products (name, price, category, image, description)
SELECT 'Golden Harvest', 18.50, 'Medium Roast', 'assets/coffee-product-7.jpg', 'Rich and buttery with a sweet caramel aroma and maple notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Harvest');

SELECT 'Rozali Colombian Supremo', 16.50, 'Dark Roast', 'assets/coffee-w8.jpg', 'Balanced and smooth with a nutty sweetness and caramel finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rozali Colombian Supremo');

INSERT INTO products (name, price, category, image, description)
SELECT 'Morning Dew Arabica', 14.90, 'Light Roast', 'assets/coffee-w6.jpg', 'Bright and crisp with a citrus zest and honeyed finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Morning Dew Arabica');

INSERT INTO products (name, price, category, image, description)
SELECT 'Ethiopian Roasted Orchid', 17.50, 'Medium-Dark', 'assets/coffee-w10.jpg', 'A bold, aromatic blend featuring spicy undertones and a silky finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ethiopian Roasted Orchid');

INSERT INTO products (name, price, category, image, description)
SELECT 'Golden Harvest', 18.50, 'Medium Roast', 'assets/coffee-w7.jpg', 'Rich and buttery with a sweet caramel aroma and maple notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Harvest');



