const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static images

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Database connection error: " + err.message);
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_string_123';

app.get('/', (req, res) => {
    res.send('AJTraders Backend API is running!');
});

// --- MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ error: "No token provided" });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: "Admin access required" });
    }
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const hash = bcrypt.hashSync(password, 10);
    db.run(`INSERT INTO Users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, address, hash], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ message: "User registered", userId: this.lastID });
        });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            // Don't send password hash back
            const { password, ...userWithoutPassword } = user;
            res.json({ token, user: userWithoutPassword });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

app.get('/api/auth/profile', verifyToken, (req, res) => {
    db.get(`SELECT id, name, email, phone, address, role, created_at FROM Users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(user);
    });
});

// --- CATEGORIES ENDPOINTS ---
app.get('/api/categories', (req, res) => {
    db.all(`SELECT * FROM Categories`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/categories', verifyToken, isAdmin, (req, res) => {
    const { name, description, image_url } = req.body;
    db.run(`INSERT INTO Categories (name, description, image_url) VALUES (?, ?, ?)`, [name, description, image_url], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, description, image_url });
    });
});

app.put('/api/categories/:id', verifyToken, isAdmin, (req, res) => {
    const { name, description, image_url } = req.body;
    db.run(`UPDATE Categories SET name = COALESCE(?, name), description = COALESCE(?, description), image_url = COALESCE(?, image_url) WHERE id = ?`,
        [name, description, image_url, req.params.id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Category updated", changes: this.changes });
        });
});

app.delete('/api/categories/:id', verifyToken, isAdmin, (req, res) => {
    db.run(`DELETE FROM Categories WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Category deleted" });
    });
});

// --- PRODUCTS ENDPOINTS ---
app.get('/api/products/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    if (!query) return res.status(400).json({ error: 'Query required' });
    
    db.all(`SELECT * FROM Products WHERE LOWER(name) LIKE ? AND is_active = 1`, [`%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products', (req, res) => {
    const category_id = req.query.category;
    let query = `SELECT * FROM Products WHERE is_active = 1`;
    let params = [];
    if (category_id) {
        query += ` AND category_id = ?`;
        params.push(category_id);
    }
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get(`SELECT * FROM Products WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Product not found" });
        res.json(row);
    });
});

app.post('/api/products', verifyToken, isAdmin, (req, res) => {
    const { name, category_id, price, stock, image_url, description } = req.body;
    db.run(`INSERT INTO Products (name, category_id, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, category_id, price, stock, image_url, description], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: "Product created" });
        });
});

app.put('/api/products/:id', verifyToken, isAdmin, (req, res) => {
    const { name, category_id, price, stock, image_url, description, is_active } = req.body;
    db.run(`UPDATE Products SET name = COALESCE(?, name), category_id = COALESCE(?, category_id), price = COALESCE(?, price), stock = COALESCE(?, stock), image_url = COALESCE(?, image_url), description = COALESCE(?, description), is_active = COALESCE(?, is_active) WHERE id = ?`,
        [name, category_id, price, stock, image_url, description, is_active, req.params.id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Product updated", changes: this.changes });
        });
});

app.delete('/api/products/:id', verifyToken, isAdmin, (req, res) => {
    db.run(`UPDATE Products SET is_active = 0 WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Product soft deleted (deactivated)" });
    });
});

// --- ORDERS ENDPOINTS ---
app.post('/api/orders', verifyToken, (req, res) => {
    const { items, total_price, delivery_address, notes } = req.body;
    const user_id = req.user.id;

    if (!items || items.length === 0) return res.status(400).json({ error: "No items in order" });

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(`INSERT INTO Orders (user_id, total_price, delivery_address, notes) VALUES (?, ?, ?, ?)`,
            [user_id, total_price, delivery_address, notes], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: err.message });
                }
                const order_id = this.lastID;
                const stmt = db.prepare(`INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`);
                items.forEach(item => {
                    stmt.run([order_id, item.product_id, item.quantity, item.price]);
                });
                stmt.finalize();
                db.run('COMMIT');
                res.status(201).json({ message: "Order placed successfully", order_id });
            });
    });
});

app.get('/api/orders', verifyToken, isAdmin, (req, res) => {
    db.all(`SELECT Orders.*, Users.name as user_name, Users.phone FROM Orders LEFT JOIN Users ON Orders.user_id = Users.id ORDER BY Orders.created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/orders/me', verifyToken, (req, res) => {
    db.all(`SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/orders/:id/status', verifyToken, isAdmin, (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE Orders SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Order status updated" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
