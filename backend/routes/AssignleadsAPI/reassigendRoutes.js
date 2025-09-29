// routes/leads.js
import express from "express";
import db from "../../config/db.js";
const router = express.Router();

// Reassign Lead
router.put("/reassign/:leadId", async (req, res) => {
  const { leadId } = req.params;
  const { assigned_to } = req.body;
  console.log("Reassigning lead:", leadId, "to employee:", assigned_to);

  if (!assigned_to) {
    return res.status(400).json({ success: false, message: "assigned_to is required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE assignedleads SET assigned_to = ? WHERE id = ?",
      [assigned_to, leadId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: "Lead reassigned successfully" });
  } catch (err) {
    console.error("Error reassigning lead:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/assignleads', async (req, res) => {
  try {
    const { leads, employeeId } = req.body;
    const connection = await pool.getConnection();

    const updatePromises = leads.map((lead) =>
      connection.query('UPDATE assignedleads SET assigned_to = ? WHERE id = ?', [employeeId, lead.id])
    );

    await Promise.all(updatePromises);
    connection.release();

    res.json({ success: true, message: 'Leads assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



router.post('/updateleadstatus', async (req, res) => {
  try {
    const { lead, status } = req.body;
    const connection = await pool.getConnection();

    await connection.query('UPDATE assignedleads SET status = ? WHERE id = ?', [status, lead.id]);

    connection.release();
    res.json({ success: true, message: 'Lead status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/reassignlead', async (req, res) => {
  try {
    const { lead, newEmployeeId } = req.body;
    const connection = await pool.getConnection();

    await connection.query('UPDATE assignedleads SET assigned_to = ? WHERE id = ?', [newEmployeeId, lead.id]);

    connection.release();
    res.json({ success: true, message: 'Lead reassigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
