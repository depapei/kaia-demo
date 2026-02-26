import Database from "better-sqlite3";
import path from "path";

const db = new Database("bakery.db");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    desc TEXT,
    longDesc TEXT,
    image TEXT,
    sliceOptions TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    postalCode TEXT,
    totalPrice INTEGER NOT NULL,
    items TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    userId TEXT NOT NULL,
    productId TEXT NOT NULL,
    PRIMARY KEY (userId, productId)
  );

  CREATE TABLE IF NOT EXISTS admins (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  );
`);

// Seed initial products if empty
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (id, name, price, category, desc, longDesc, image, sliceOptions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    {
      id: "vanila-cake",
      name: "Vanila Cake",
      price: 200000,
      category: "Cakes",
      desc: "Perpaduan Vanila dengan buah - buahan",
      longDesc: "A timeless classic. Our Vanilla Cake features three layers of moist, Madagascar vanilla bean sponge, filled with fresh seasonal fruits and enveloped in a light, whipped cream frosting.",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
      sliceOptions: JSON.stringify([
        { slices: "Full", price: 200000 },
        { slices: 10, price: 180000 },
        { slices: 4, price: 80000 },
        { slices: 3, price: 65000 }
      ])
    },
    {
      id: "chocolate-cake",
      name: "Chocolate Cake",
      price: 150000,
      category: "Cakes",
      desc: "Perpaduan Coklat dengan buah - buahan",
      longDesc: "Indulge in pure decadence. Rich 70% dark chocolate ganache layered between moist cocoa sponge, topped with a medley of fresh berries for a perfect balance of sweetness and tartness.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
      sliceOptions: JSON.stringify([
        { slices: "Full", price: 150000 },
        { slices: 10, price: 135000 },
        { slices: 4, price: 60000 },
        { slices: 3, price: 50000 }
      ])
    },
    {
      id: "cupcake",
      name: "Cupcake",
      price: 110000,
      category: "Pastries",
      desc: "Cupcake Coklat dan chococips",
      longDesc: "Bite-sized perfection. Our signature chocolate cupcakes are studded with Belgian chocolate chips and topped with a silky smooth chocolate buttercream swirl.",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800",
      sliceOptions: null
    },
    {
      id: "sourdough-loaf",
      name: "Artisan Sourdough",
      price: 85000,
      category: "Breads",
      desc: "48-hour fermented rustic loaf",
      longDesc: "Our pride and joy. A crusty, rustic loaf with a soft, airy crumb and that signature sourdough tang. Made with just flour, water, salt, and 30 years of tradition.",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800",
      sliceOptions: null
    }
  ];

  for (const p of initialProducts) {
    insert.run(p.id, p.name, p.price, p.category, p.desc, p.longDesc, p.image, p.sliceOptions);
  }
}

// Seed admin if empty
const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
if (adminCount.count === 0) {
  db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)").run("admin", "admin123");
}

export default db;
