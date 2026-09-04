const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    const imageUrl = 'http://localhost:5000/images/categories/pulses.webp';
    db.run(`UPDATE Categories SET image_url = ? WHERE name = 'Pulses'`, [imageUrl], function(err) {
        if(err) {
            console.error(err);
        } else {
            console.log(`Updated Pulses category. Changes: ${this.changes}`);
        }
    });
});

setTimeout(() => {
    db.close();
}, 1000);
