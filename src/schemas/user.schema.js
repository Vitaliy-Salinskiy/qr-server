import { Schema, model } from 'mongoose';

const ScanHistorySchema = new Schema({
	date: { type: Date, required: true },
	totalScans: { type: Number, required: true },
})

const UserSchema = new Schema({

	id: { type: String, required: true, unique: true, immutable: true, },

	lastScanned: { type: Date, default: null, },

	timesScanned: { type: Number, default: 0, },

	scanHistory: { type: [ScanHistorySchema], default: [], },

	name: { type: String, },

	surname: { type: String },

	requests: [{ type: Schema.Types.ObjectId, ref: 'Request', default: [] }]

});

const User = model('User', UserSchema);

export default User;