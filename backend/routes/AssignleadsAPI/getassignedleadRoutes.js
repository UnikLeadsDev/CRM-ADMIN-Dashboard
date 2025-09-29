import express from 'express';
import pool from '../../config/db.js'; // adjust path if needed

const router = express.Router();

// GET leads by employee ID
// Example: /api/leads/123
router.get('/leads/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  console.log("Employee ID from request:", req.params.employeeId);

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM assignedleads WHERE assigned_to = ?`,
      [employeeId]
    );

    connection.release();

    res.json({
      success: true,
      employeeId,
      totalLeads: rows.length,
      leads: rows
    });
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all leads
router.get('/getassignleads', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM assignedleads ORDER BY date DESC`
    );

    connection.release();

    res.json({
      success: true,
      totalLeads: rows.length,
      leads: rows
    });
  } catch (error) {
    console.error('Error fetching all leads:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


export default router;
