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

-- Seed Products (using local coffee-wX.jpg naming)
INSERT INTO products (name, price, category, image, description)
SELECT 'Ethiopian Yirgacheffe', 1250.00, 'Light Roast', 'assets/coffee-w1.jpg', 'Bright, floral coffee with notes of jasmine and lemon.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ethiopian Yirgacheffe');

INSERT INTO products (name, price, category, image, description)
SELECT 'Blank Espresso Mandheling', 1400.00, 'Medium Roast', 'assets/coffee-w3.jpg', 'Full-bodied and earthy with low acidity.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Blank Espresso Mandheling');

INSERT INTO products (name, price, category, image, description)
SELECT 'Colombian Supremo', 1100.00, 'Dark Roast', 'assets/coffee-w2.jpg', 'Balanced and smooth with a nutty sweetness and caramel finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Colombian Supremo');

INSERT INTO products (name, price, category, image, description)
SELECT 'Sumatra Blend', 1850.00, 'Dark Roast', 'assets/coffee-w4.jpg', 'Rich crema and intense flavor. Perfect for espresso machines.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sumatra Blend');

INSERT INTO products (name, price, category, image, description)
SELECT 'Morning Dew Arabica', 950.00, 'Medium Roast', 'assets/coffee-w5.jpg', 'Bright and crisp with a citrus zest and honeyed finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Morning Dew Arabica');

INSERT INTO products (name, price, category, image, description)
SELECT 'Sun-Drenched Sidamo', 1950.00, 'DARK Roast', 'assets/coffee-w6.jpg', 'Authentic Ethiopian heirloom with complex jasmine and tea-like notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sun-Drenched Sidamo');

INSERT INTO products (name, price, category, image, description)
SELECT 'Roasted Orchid', 1600.00, 'Medium-Dark', 'assets/coffee-w7.jpg', 'A bold, aromatic blend featuring spicy undertones and a silky finish.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roasted Orchid');

INSERT INTO products (name, price, category, image, description)
SELECT 'Golden Harvest', 1750.00, 'Medium Roast', 'assets/coffee-w8.jpg', 'Rich and buttery with a sweet caramel aroma and maple notes.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Golden Harvest');
