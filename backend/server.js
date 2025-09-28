import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AssignedRoute from './routes/AssignleadsAPI/assignedleadsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/assignedleads', AssignedRoute);

const pool = mysql.createPool({
  host: 'channelpartner.cwniws4uuerg.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'channelpartner',
  database:'channelpartner',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const validateLead = (req, res, next) => {
  const fullName = req.body.full_name?.trim() || req.body.fullName?.trim();
  const mobileNumber = req.body.mobileNumber;
  const product = req.body.product || req.body.requirementType;
  const loanAmount = req.body.loanAmount;

  const errors = [];

  if (!fullName || fullName.length < 2) {
    errors.push('Customer name is required and must be at least 2 characters');
  }

  if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
    errors.push('Mobile number must be a valid 10-digit Indian number');
  }

  if (!product) {
    errors.push('Product type is required');
  }

  if (!loanAmount || loanAmount <= 0) {
    errors.push('Loan amount must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// ✅ POST /api/leads - Create new lead
app.post('/api/leads', validateLead, async (req, res) => {
  try {
  
    // Normalize input (prevent undefined going into MySQL)
    const leadData = {
      full_name: req.body.full_name?.trim() || req.body.fullName?.trim() || null,
      mobile_number: req.body.mobileNumber || null,
      product: req.body.product || req.body.requirementType || null,
      loan_amount: Number(req.body.loanAmount) || 0,
      email: req.body.email?.toLowerCase() || null,
      pancard_number: req.body.pancardNumber?.toUpperCase() || null,
      aadhar_number: req.body.aadharNumber || null,
      area_pincode: req.body.areaPincode || null,
      monthly_income: Number(req.body.monthlyIncome) || null,
      source_of_income: req.body.sourceOfIncome || null,
      lead_status: 'New',
      referral_code: req.body.referralCode || null,
      lead_type: req.body.leadType || null   // 👈 Added back lead_type
    };
    
    const [result] = await pool.query(
      `INSERT INTO leads 
       (full_name, mobile_number, product, loan_amount, email, pancard_number, 
        aadhar_number, area_pincode, monthly_income, source_of_income, 
        lead_status, referral_code, lead_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        leadData.full_name,
        leadData.mobile_number,
        leadData.product,
        leadData.loan_amount,
        leadData.email,
        leadData.pancard_number,
        leadData.aadhar_number,
        leadData.area_pincode,
        leadData.monthly_income,
        leadData.source_of_income,
        leadData.lead_status,
        leadData.referral_code,
        leadData.lead_type
      ]
    );
 

    const leadId = result.insertId;
    console.log(`Lead created with ID: ${leadId}`);

    const formattedAmount =
      new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
        leadData.loan_amount || 0
      ) + '/-';

      
    res.status(200).json({
      success: true,
      message: 'Lead added successfully',
      lead: {
        leadId,
        full_name: leadData.full_name,
        mobileNumber: leadData.mobile_number,
        product: leadData.product,
        loanAmount: formattedAmount,
        leadStatus: leadData.lead_status,
        leadType: leadData.lead_type   // 👈 Also send in response
      }
    });
  } catch (error) {
    console.error('Error creating lead:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create lead. Please try again.',
      details: error.message
    });
  }
});

app.get('/api/getid', async (req, res) => {
    console.log('Inside getid api');
    try{
        console.log('Fetching latest lead id...');
        const result= await pool.query(`SELECT lead_id FROM leads ORDER BY lead_id DESC LIMIT 1`);
        console.log('Fetched lead id:');
        console.log(result[0][0].lead_id);
        res.status(200).json({success:true, leadid:result[0][0].lead_id});

    }catch(error){
        console.error('Error fetching lead id:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve lead id' });
    }
})




// ✅ GET /api/getleads - fetch all leads
app.get('/api/getleads', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM leads ORDER BY created_at DESC`
    );

    res.json({ success: true, leads: rows });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ GET /api/leads/:id - fetch single lead by ID
app.get('/api/leads/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lead_id, full_name, mobile_number, product, loan_amount, lead_status 
       FROM leads WHERE lead_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, lead: rows[0] });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve lead' });
  }
});


// GET /api/partners - Fetch all partners
app.get('/api/getpartners', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM channel_partners`);
    res.json({ success: true, partners: rows });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve partners' });
  }
});


// ✅ PUT /api/leads/:id/status - update lead status
app.put('/api/leads/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const [result] = await pool.query(
      `UPDATE leads SET lead_status = ?, updated_at = NOW() WHERE lead_id = ?`,
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({
      success: true,
      message: 'Lead status updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ success: false, message: 'Failed to update lead status' });
  }
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- TEST DB ENDPOINT ---
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ success: true, dbTest: rows[0] });
    } catch (err) {
        console.error('DB Test Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- API ENDPOINTS ---

/**
 * GET /api/partners/:id
 */
app.get('/api/partners/:id', async (req, res) => {
    const partnerId = req.params.id;
    try {
        const [partnerRows] = await pool.query('SELECT * FROM channel_partners WHERE id = ?', [partnerId]);
        if (partnerRows.length === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        const partner = partnerRows[0];
        const [documentRows] = await pool.query('SELECT * FROM partner_documents WHERE partner_id = ?', [partnerId]);
        const responseData = { ...partner, documents: documentRows };
        res.json(responseData);
    } catch (error) {
        console.error('Failed to fetch partner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/partners/:id/decision
 */
app.patch('/api/partners/:id/decision', async (req, res) => {
    const partnerId = req.params.id;
    const { final_decision, final_decision_reason } = req.body;
    if (!final_decision || !['Approved', 'Rejected'].includes(final_decision)) {
        return res.status(400).json({ message: "Invalid 'final_decision'. Must be 'Approved' or 'Rejected'." });
    }
    try {
        const query = 'UPDATE channel_partners SET final_decision = ?, final_decision_reason = ?, approval_date = NOW() WHERE id = ?';
        const [result] = await pool.query(query, [final_decision, final_decision_reason, partnerId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        res.json({ message: `Partner final decision updated to ${final_decision}` });
    } catch (error) {
        console.error('Failed to update final decision:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/partners/:id/section-status
 */
app.patch('/api/partners/:id/section-status', async (req, res) => {
    const partnerId = req.params.id;
    const { section, status, reason } = req.body;

    console.log(`--- New PATCH request for partner ID: ${partnerId} ---`);
    console.log('Received body:', req.body);

    const validSections = [
        'applicant_details', 
        'current_address', 
        'permanent_address', 
        'kyc_documents', 
        'banking_details'
    ];
    
    if (!section || !validSections.includes(section)) {
        console.error('Validation failed: Invalid section provided.');
        return res.status(400).json({ message: `Invalid 'section' provided. Must be one of: ${validSections.join(', ')}` });
    }

    if (!status || !['Approved', 'Rejected'].includes(status)) {
        console.error('Validation failed: Invalid status provided.');
        return res.status(400).json({ message: "Invalid 'status' provided. Must be 'Approved' or 'Rejected'." });
    }

    const statusColumn = `${section}_status`;
    const reasonColumn = `${section}_reason`;

    try {
        const updateQuery = `
            UPDATE channel_partners 
            SET ${mysql.escapeId(statusColumn)} = ?, ${mysql.escapeId(reasonColumn)} = ? 
            WHERE id = ?
        `;
        
        console.log('Executing SQL:', updateQuery.trim().replace(/\s+/g, ' '));
        
        const [result] = await pool.query(updateQuery, [status, reason, partnerId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        console.log('Update successful!');
        res.json({ message: `Section '${section}' for partner ${partnerId} has been updated to '${status}'.` });

    } catch (error) {
        console.error(`--- SQL ERROR for section ${section} ---:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// ✅ Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
