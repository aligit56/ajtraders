const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbFile = './database.sqlite';

if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
}

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Database connected.");
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT NOT NULL,
            address TEXT,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Categories
        db.run(`CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Products
        db.run(`CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            image_url TEXT,
            description TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE RESTRICT
        )`);

        // Orders
        db.run(`CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            delivery_address TEXT NOT NULL,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES Users(id)
        )`);

        // OrderItems
        db.run(`CREATE TABLE IF NOT EXISTS OrderItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY(order_id) REFERENCES Orders(id) ON DELETE CASCADE,
            FOREIGN KEY(product_id) REFERENCES Products(id)
        )`);

        // Discounts
        db.run(`CREATE TABLE IF NOT EXISTS Discounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            discount_percent INTEGER NOT NULL,
            valid_until DATETIME NOT NULL,
            FOREIGN KEY(product_id) REFERENCES Products(id) ON DELETE CASCADE
        )`);

        // Indexes
        db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON Products(category_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_orders_user ON Orders(user_id)`);

        seedData();
    });
}

function seedData() {
    console.log("Seeding data...");
    
    const adminHash = bcrypt.hashSync('admin123', 10);
    const custHash = bcrypt.hashSync('customer123', 10);
    
    db.run(`INSERT INTO Users (name, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?)`, 
        ['Admin User', 'admin@ajtraders.pk', '03000000000', 'Admin HQ', adminHash, 'admin']);
        
    db.run(`INSERT INTO Users (name, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?)`, 
        ['Test Customer', 'customer@ajtraders.pk', '03001234567', 'House 1, Street 2, G-6 Islamabad', custHash, 'customer']);

    const categories = ['Pulses', 'Rice', 'Flour', 'Spices', 'Household', 'Cosmetics'];
    const catStmt = db.prepare(`INSERT INTO Categories (name) VALUES (?)`);
    categories.forEach(cat => catStmt.run(cat));
    catStmt.finalize();

    const products = [
        ['Daal Chana (1kg)', 1, 350.00, 50, 'Premium quality chana daal'],
        ['Daal Masoor (1kg)', 1, 320.00, 45, 'High protein masoor daal'],
        ['Super Kernel Basmati Rice (5kg)', 2, 1800.00, 20, 'Aged basmati rice'],
        ['Broken Rice / Tota (1kg)', 2, 250.00, 100, 'Daily use broken rice'],
        ['Chakki Atta (10kg)', 3, 1500.00, 30, 'Pure whole wheat flour'],
        ['Fine Atta (10kg)', 3, 1450.00, 25, 'White flour for baking and rotis'],
        ['National Red Chilli Powder (200g)', 4, 250.00, 60, 'Spicy red chilli'],
        ['Shan Biryani Masala', 4, 120.00, 80, 'Classic biryani mix'],
        ['Surf Excel (1kg)', 5, 550.00, 40, 'Washing machine powder'],
        ['Lifebuoy Soap (Pack of 3)', 6, 280.00, 50, 'Total 10 protection']
    ];

    const prodStmt = db.prepare(`INSERT INTO Products (name, category_id, price, stock, description) VALUES (?, ?, ?, ?, ?)`);
    products.forEach(p => prodStmt.run(p));
    prodStmt.finalize(() => {
        console.log("Seeding complete.");
        db.close();
    });
}
