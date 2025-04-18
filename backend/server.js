const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const PORT = 6000;
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
  
  db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected');
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));