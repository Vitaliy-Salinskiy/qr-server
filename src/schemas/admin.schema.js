import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
	username: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
});

const Admin = model('Admin', adminSchema);

export default Admin;