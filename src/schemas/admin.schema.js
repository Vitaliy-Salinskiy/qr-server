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
 *       example: 65b09a2afd9a1b910c069814
 *      username:
 *       type: string
 *       trim: true
 *       unique: true
 *       description: Username of the admin
 *       example: admin
 *      password:
 *       type: string
 *       trim: true
 *       description: Hashed password of the admin
 *       example: $2a$10$gy.DwkAqUKysES06MHE5v.YzvHgs8HUkPxKXhM4utVlqXXlwQjHQW
 */

const adminSchema = new Schema({
	username: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
});

const Admin = model('Admin', adminSchema);

export default Admin;