const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const app = express();
const PORT = 3000;
const SECRET_KEY = '1234';

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

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
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

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during user lookup' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });

      db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: 'Error saving user to database' });
          res.status(201).json({ message: 'User created successfully' });
        }
      );
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
  

app.delete('/applications/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM applications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Application deleted successfully' });
    });
  });
  
  app.patch('/applications/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    db.query(
      'UPDATE applications SET  status = ? WHERE id = ? AND user_id = ?',
      [ status, req.params.id, req.user.id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Application updated successfully' });
      }
    );
  });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));