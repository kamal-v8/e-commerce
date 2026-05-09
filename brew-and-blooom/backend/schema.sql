-- 1. Ensure tables exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLEAR OLD DATA (This allows the reorder to work)
TRUNCATE TABLE products;

-- 3. INSERT NEW REORDERED DATA
INSERT INTO products (name, price, category, image, description) VALUES
('Luna Yirgacheffe', 18.90, 'Light Roast', 'assets/coffee-w2.jpg', 'Bright, floral coffee with notes of jasmine and lemon.'),
('Morning Dew Arabica', 14.90, 'Light Roast', 'assets/coffee-w6.jpg', 'Bright and crisp with a citrus zest and honeyed finish.'),
('Golden Harvest', 18.50, 'Medium Roast', 'assets/coffee-w7.jpg', 'Rich and buttery with a sweet caramel aroma and maple notes.'),
('Espresso Mandheling', 19.00, 'Medium Roast', 'assets/coffee-w3.jpg', 'Full-bodied and earthy with low acidity.'),
('Sumatra Blend', 10.00, 'Dark Roast', 'assets/coffee-w1.jpg', 'Rich crema and intense flavored Coffee.'),
('Rozali Colombian Supremo', 16.50, 'Dark Roast', 'assets/coffee-w8.jpg', 'Balanced and smooth with a nutty sweetness and caramel finish.'),
('Ethiopian Roasted Orchid', 17.50, 'Medium-Dark', 'assets/coffee-w5.jpg', 'A bold, aromatic blend featuring spicy undertones and a silky finish.');


