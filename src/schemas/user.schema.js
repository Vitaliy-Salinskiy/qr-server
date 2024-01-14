import mongoose, { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	lastScanned: {
		type: Date,
		default: null,
	},
	timesScanned: {
		type: Number,
		default: 0,
	},
});

const User = model('User', UserSchema);

export default User;