import express from 'express';
import pool from '../../config/db.js'; // adjust path if needed

const router = express.Router();

// GET leads by employee ID
// Example: /api/leads/123
// router.get('/leads/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   console.log("Employee ID from request:", req.params.employeeId);

//   try {
//     const connection = await pool.getConnection();

//     const [rows] = await connection.query(
//       `SELECT * FROM assignedleads WHERE assigned_to = ?`,
//       [employeeId]
//     );

//     connection.release();

//     res.json({
//       success: true,
//       employeeId,
//       totalLeads: rows.length,
//       leads: rows
//     });
//   } catch (error) {
//     console.error('Error fetching leads:', error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// Get all leads
router.get('/getgeneratedleads', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT * FROM leads`
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

router.put('/updateleadstatus/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const connection = await pool.getConnection();

    // 🔹 1. Update the status (this will also update `updated_at` automatically)
    const [result] = await connection.query(
      `UPDATE leads 
       SET lead_status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE lead_id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // 🔹 2. Fetch the updated record
    const [updatedLead] = await connection.query(
      `SELECT * FROM leads WHERE lead_id = ?`,
      [id]
    );

    connection.release();

    // 🔹 3. Send updated data back to frontend
    res.json({
      success: true,
      message: 'Lead status updated successfully',
      updatedLead: updatedLead[0],
    });

  } catch (error) {
    console.error('Error updating lead status:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});



export default router;
