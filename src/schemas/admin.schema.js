import { Schema, model } from 'mongoose';

/**
 * @swagger
 *  components:
 *   schemas:
 *    Admin:
 *     type: object
 *     required:
 *      -username
 *      -password
 *     properties:
 *      _id:
 *       type: string
 *       description: MongoDB unique identifier
 *      username:
 *       type: string
 *       unique: true
 *       description: Username of the admin
 *      password:
 *       type: string
 *       description: Hashed password of the admin
 */

const adminSchema = new Schema({
	username: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
});

const Admin = model('Admin', adminSchema);

export default Admin;