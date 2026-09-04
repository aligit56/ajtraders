const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // Add image_url column if not exists
    try {
        db.run(`ALTER TABLE Categories ADD COLUMN image_url TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                console.log(err.message);
            }
        });
    } catch(e) {}

    // 1. Delete Flour category
    db.run(`DELETE FROM Categories WHERE name = 'Flour'`, function(err) {
        if(err) console.log(err);
        else console.log('Deleted Flour category');
    });

    // We also need to map products that were in Flour to something else.
    // Flour was id 3 originally. We will move them to everyday grocery when inserted.

    const newCategories = [
        ['Cleaning and Laundry', 'Detergent, soap, cleaning supplies', 'https://placehold.co/320x240/4da6ff/ffffff?text=Cleaning'],
        ['Personal Care', 'Facewash, shampoo, skincare, hygiene', 'https://placehold.co/320x240/ff69b4/ffffff?text=Personal+Care'],
        ['Tea or Coffee', 'Tea, coffee, beverages', 'https://placehold.co/320x240/8b6f47/ffffff?text=Tea+or+Coffee'],
        ['Noodle and Macaronis', 'Instant noodles, pasta, macaroni', 'https://placehold.co/320x240/ffd700/000000?text=Noodles'],
        ['Oil and Ghee', 'Cooking oil, ghee, butter', 'https://placehold.co/320x240/ff9500/ffffff?text=Oil+and+Ghee'],
        ['Everyday Grocery', 'Essential items, staples, miscellaneous', 'https://placehold.co/320x240/00b300/ffffff?text=Grocery']
    ];

    const stmt = db.prepare(`INSERT INTO Categories (name, description, image_url) VALUES (?, ?, ?)`);
    newCategories.forEach(cat => stmt.run(cat, (err) => {
        if(err && !err.message.includes('UNIQUE constraint failed')) {
            console.log(err.message);
        }
    }));
    stmt.finalize();

    // Update existing categories with placehold URLs
    const updates = {
        'Pulses': 'https://placehold.co/320x240/cc0000/ffffff?text=Pulses',
        'Rice': 'https://placehold.co/320x240/f5f5f5/000000?text=Rice',
        'Spices': 'https://placehold.co/320x240/ff6b00/ffffff?text=Spices',
        'Household': 'https://placehold.co/320x240/9933ff/ffffff?text=Household',
        'Cosmetics': 'https://placehold.co/320x240/ff1493/ffffff?text=Cosmetics'
    };

    for (const [name, url] of Object.entries(updates)) {
        db.run(`UPDATE Categories SET image_url = ? WHERE name = ?`, [url, name]);
    }

    // Move Flour products (category 3) to Everyday Grocery
    db.get(`SELECT id FROM Categories WHERE name = 'Everyday Grocery'`, (err, row) => {
        if (row) {
            db.run(`UPDATE Products SET category_id = ? WHERE category_id = 3`, [row.id], () => {
                console.log("Moved Flour products to Everyday Grocery");
            });
        }
    });

});

setTimeout(() => {
    console.log("Migration finished.");
    db.close();
}, 2000);
