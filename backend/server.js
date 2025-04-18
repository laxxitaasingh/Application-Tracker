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
  
  db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected');
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));