import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from "uuid";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Migration: Add columns if they don't exist
  try {
    db.prepare("ALTER TABLE transactions ADD COLUMN city TEXT").run();
    db.prepare("ALTER TABLE transactions ADD COLUMN postalCode TEXT").run();
    db.prepare("ALTER TABLE transactions ADD COLUMN userId TEXT").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE products ADD COLUMN sliceOptions TEXT").run();
  } catch (e) {}

  // --- API Routes ---

  // Admin Auth
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND password = ?").get(username, password);
    if (admin) {
      res.json({ success: true, token: "admin-token-" + uuidv4() });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // User Auth
  app.post("/api/user/register", (req, res) => {
    const { email, password, name } = req.body;
    const id = uuidv4();
    try {
      db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)")
        .run(id, email, password, name);
      res.json({ success: true, user: { id, email, name } });
    } catch (e) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  app.post("/api/user/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT id, email, name FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // User Transactions
  app.get("/api/user/transactions/:userId", (req, res) => {
    const { userId } = req.params;
    const transactions = db.prepare("SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC").all(userId);
    res.json(transactions);
  });

  // Wishlist
  app.get("/api/wishlist/:userId", (req, res) => {
    const { userId } = req.params;
    const items = db.prepare(`
      SELECT p.* FROM products p
      JOIN wishlist w ON p.id = w.productId
      WHERE w.userId = ?
    `).all(userId);
    res.json(items);
  });

  app.post("/api/wishlist", (req, res) => {
    const { userId, productId } = req.body;
    try {
      db.prepare("INSERT INTO wishlist (userId, productId) VALUES (?, ?)").run(userId, productId);
      res.json({ success: true });
    } catch (e) {
      res.json({ success: true }); // Already in wishlist
    }
  });

  app.delete("/api/wishlist/:userId/:productId", (req, res) => {
    const { userId, productId } = req.params;
    db.prepare("DELETE FROM wishlist WHERE userId = ? AND productId = ?").run(userId, productId);
    res.json({ success: true });
  });

  // Products CRUD
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, price, category, desc, longDesc, image, sliceOptions } = req.body;
    const id = uuidv4();
    db.prepare("INSERT INTO products (id, name, price, category, desc, longDesc, image, sliceOptions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(id, name, price, category, desc, longDesc, image, sliceOptions ? JSON.stringify(sliceOptions) : null);
    res.json({ success: true, id });
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, category, desc, longDesc, image, sliceOptions } = req.body;
    db.prepare("UPDATE products SET name = ?, price = ?, category = ?, desc = ?, longDesc = ?, image = ?, sliceOptions = ? WHERE id = ?")
      .run(name, price, category, desc, longDesc, image, sliceOptions ? JSON.stringify(sliceOptions) : null, id);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Transactions
  app.get("/api/transactions", (req, res) => {
    const transactions = db.prepare("SELECT * FROM transactions ORDER BY createdAt DESC").all();
    res.json(transactions);
  });

  app.post("/api/transactions", (req, res) => {
    const { userId, customerName, customerEmail, address, city, postalCode, totalPrice, items } = req.body;
    const id = uuidv4();
    const tx = { 
      id, 
      userId,
      customerName, 
      customerEmail, 
      address, 
      city, 
      postalCode, 
      totalPrice, 
      items: JSON.stringify(items) 
    };
    
    db.prepare("INSERT INTO transactions (id, userId, customerName, customerEmail, address, city, postalCode, totalPrice, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(tx.id, tx.userId, tx.customerName, tx.customerEmail, tx.address, tx.city, tx.postalCode, tx.totalPrice, tx.items);
    
    res.json({ success: true, id, transaction: tx });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
