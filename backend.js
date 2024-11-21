const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'student_management',
    password: 'your_password',
    port: 5432,
});
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());


app.post('/students', async (req, res) => {
    console.log("hello")
    console.log(req.body);
    const { student_id, first_name, last_name, date_of_birth, email, enrollment_date, courses } = req.body;
    try {
        const query = `INSERT INTO students (student_id, first_name, last_name, date_of_birth, email, enrollment_date, courses)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await pool.query(query, [student_id, first_name, last_name, date_of_birth, email, enrollment_date, courses]);
        console.log("sucess")
        res.status(201).json({ message: 'Student added successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/students/:student_id', async (req, res) => {
    try {
        const { student_id } = req.params;
        const result = await pool.query('SELECT * FROM students WHERE student_id = $1', [student_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/students/:student_id', async (req, res) => {
    const { student_id } = req.params;
    const { first_name, last_name, date_of_birth, email, enrollment_date, courses } = req.body;
    try {
        const query = `UPDATE students SET first_name = $1, last_name = $2, date_of_birth = $3, email = $4, enrollment_date = $5, courses = $6
                   WHERE student_id = $7`;
        const result = await pool.query(query, [first_name, last_name, date_of_birth, email, enrollment_date, courses, student_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/students/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const result = await pool.query('DELETE FROM students WHERE student_id = $1', [student_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
