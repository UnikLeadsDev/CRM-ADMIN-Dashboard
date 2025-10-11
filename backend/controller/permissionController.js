import pool from '../config/db.js';

// POST /admin/user-permissions
export const addUserPermission = async (req, res) => {
  const {
    user_id,
    camera_permission = false,
    location_permission = false,
    contacts_permission = false,
    storage_permission = false,
    phone_permission = false,
    accounts_permission = false,
    apps_permission = false,
    call_log_permission = false,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO user_permissions
      (user_id, camera_permission, location_permission, contacts_permission, storage_permission, phone_permission, accounts_permission, apps_permission, call_log_permission)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        camera_permission,
        location_permission,
        contacts_permission,
        storage_permission,
        phone_permission,
        accounts_permission,
        apps_permission,
        call_log_permission,
      ]
    );

    res.status(201).json({
      message: "User permissions added successfully",
      data: { id: result.insertId, user_id, camera_permission, location_permission, contacts_permission, storage_permission, phone_permission, accounts_permission, apps_permission, call_log_permission }
    });
  } catch (err) {
    console.error("Add User Permission Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
