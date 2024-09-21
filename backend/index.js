const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'product_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;
  db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], (err) => {
    if (err) throw err;
    res.send({ message: 'Quantity updated successfully' });
  });
});

app.post('/shopping-carts', (req, res) => {
  db.query('INSERT INTO shopping_carts VALUES ()', {}, (err, results) => {
    if (err) throw err;
    res.send({ id: results.insertId });
  });
});

app.get('/shopping-carts/:id/items', (req, res) => {
  const { id } = req.params;
  db.query('SELECT ci.id, p.name, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?', [id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/shopping-carts/:id/items', (req, res) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;
  db.query('INSERT INTO cart_items SET ?', { cart_id: id, product_id, quantity }, (err) => {
    if (err) throw err;
    res.send({ message: 'Product added to cart' });
  });
});

app.delete('/shopping-carts/:id/items/:product_id', (req, res) => {
  const { id, product_id } = req.params;
  db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [id, product_id], (err) => {
    if (err) throw err;
    res.send({ message: 'Product removed from cart' });
  });
});

app.post('/orders', (req, res) => {
  const { cart_id } = req.body;
  db.query('SELECT SUM(p.price * ci.quantity) AS total_price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?', [cart_id], (err, results) => {
    if (err) throw err;
    const { total_price } = results[0];
    db.query('INSERT INTO orders SET ?', { total_price }, (err, results) => {
      if (err) throw err;
      db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id], (err) => {
        if (err) throw err;
        res.send({ message: 'Order created' });
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});