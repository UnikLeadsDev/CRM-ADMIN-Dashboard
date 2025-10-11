import express from 'express';


import { addUserPermission } from '../controller/permissionController.js';

const router = express.Router();

// Route to add user permissions
router.post('/user-permissions', addUserPermission);

export default router;