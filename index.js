const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.get('/students/:id/scores', async (req, res) => {
    // id của học sinh front-end muốn truyền xuống
    const { id } = req.params;
  
    try {
        // check student exist in database
        const findStudent = await pool.query(`SELECT * FROM Student WHERE id = ${id}`);

        if (!findStudent) return res.status(404).json({ error: 'not found student' });
        
        const scores = await pool.query(`SELECT * FROM Score WHERE student_id = ${id}`);
        res.json(scores.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/students/scores', async (req, res) => {
    const { student_id, subject, score } = req.body;

    try {
        // check student exist in database
        const findStudent = await pool.query(`SELECT * FROM Student WHERE id = ${student_id}`);

        if (!findStudent) return res.status(404).json({ error: 'not found student' });
            
        // Thực hiện cập nhật điểm số của học sinh vào cơ sở dữ liệu
        const result = await pool.query(`
            UPDATE Score
            SET score = ${score}
            WHERE student_id = ${student_id} AND subject = '${subject}'
        `);

        res.status(200).send(`Đã cập nhật điểm số của học sinh ${student_id} môn ${subject} thành công`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật điểm số của học sinh');
    }
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
