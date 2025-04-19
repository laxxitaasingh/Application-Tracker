const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const PORT = 6000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const corsOptions ={
    origin : 'http://localhost:4200',
    credentials : true
}


const app= express();
app.use(cors(corsOptions));
app.use(express.json());
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345677',
    database: '10aprbeta'
  });

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader 
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

  app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error saving user to database' });
        res.status(201).json({ message: 'User created successfully' });
      });
    });
  });


  // User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
          res.json({ token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    });
  });

  app.get('/applications', authenticateToken, (req, res) => {
    console.log(req.user.id)
    db.query('SELECT * FROM applications WHERE user_id = ?', [req.user.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });
  

  app.post('/applications', authenticateToken,(req, res) => {
    const { company, position, status } = req.body;
    const userId = req.user.id;
    db.query(
      'INSERT INTO applications (company, position, status, user_id) VALUES (?, ?, ?, ?)',
      [company, position, status, userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: result.insertId });
      }
    );
  });
  
  db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected');
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));