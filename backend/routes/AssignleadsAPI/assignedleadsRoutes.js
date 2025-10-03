import express from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import pool from '../../config/db.js'; // adjust path if needed

const router = express.Router();

// Multer config
const upload = multer({ dest: 'uploads/' });

// Helper function to parse DD-MM-YYYY to YYYY-MM-DD
const parseDate = (dateStr) => {
  if (!dateStr) return null; // handle empty date
  const [day, month, year] = dateStr.split('-');
  if (!day || !month || !year) return null; // invalid format
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

router.post('/upload-csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  const failedRows = [];

  try {
    const connection = await pool.getConnection();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        for (const row of results) {
          try {
            await connection.query(
              `INSERT INTO assignedleads 
                (date, name, phone, email, product, city,location, assigned_to, status) 
                VALUES (NOW(), ?, ?, ?, ?, ?,?, ?, ?)`,
                [
                  row.Name,
                  row.Phone,
                  row.Email,
                  row.Product,
                  row.City,
                  row.Locations,
                  row['Assigned To'],
                  row.Status
                ]
            );
          } catch (err) {
            console.error('Failed row:', row, err.message);
            failedRows.push(row);
          }
        }

        connection.release();
        fs.unlinkSync(filePath); // cleanup temp file

        res.json({
          processedCount: results.length,
          failedCount: failedRows.length,
          failedRows
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
