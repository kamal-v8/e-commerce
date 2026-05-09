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
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Seed Initial Products (Using INSERT INTO ... SELECT for robust seeding)
INSERT INTO products (name, price, category, image, description)
SELECT 'Luna Yirgacheffe', 1890, 'Light Roast', 'assets/coffee-w2.jpg', 'Bright, floral coffee with notes of jasmine and lemon.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ethiopian Yirgacheffe');

INSERT INTO products (name, price, category, image, description)
SELECT 'Espresso Mandheling', 1900, 'Medium Roast', 'assets/coffee-w3.jpg', 'Full-bodied and earthy with low acidity.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Simple Espresso Mandheling');


INSERT INTO products (name, price, category, image, description)
SELECT 'Sumatra Blend ', 1000, 'Dark Roast', 'assets/coffee-w1.jpg', 'Rich crema and intense flavored Coffee.' 
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sumatra Blend');

INSERT INTO products (name, price, category, image, description)
SELECT 'Rozali Colombian Supremo', 1650, 'Dark Roast', 'assets/coffee-w8.jpg', 'Balanced and smooth with a nutty sweetness and caramel finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rozali Colombian Supremo');

INSERT INTO products (name, price, category, image, description)
SELECT 'Morning Dew Arabica', 1490, 'Light Roast', 'assets/coffee-w6.jpg', 'Bright and crisp with a citrus zest and honeyed finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Morning Dew Arabica');

INSERT INTO products (name, price, category, image, description)
SELECT 'Ethiopian Roasted Orchid', 1750, 'Medium-Dark', 'assets/coffee-w5.jpg', 'A bold, aromatic blend featuring spicy undertones and a silky finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ethiopian Roasted Orchid');

INSERT INTO products (name, price, category, image, description)
SELECT 'Golden Harvest', 1850, 'Medium Roast', 'assets/coffee-w7.jpg', 'Rich and buttery with a sweet caramel aroma and maple notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Harvest');



