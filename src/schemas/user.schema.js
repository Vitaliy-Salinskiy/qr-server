import { Schema, model } from 'mongoose';

/**
 * @swagger
 * components: 
 *  schemas:
 *   ScanHistory:
 *     type: object
 *     required:
 *       -date
 *       -totalScans
 *     properties:
 *       _id: 
 *        type: string
 *        description: MongoDB unique identifier 
 *       date: 
 *         type: string
 *         format: date-time
 *         description: Date of the scan
 *       totalScans:
 *         type: integer
 *         description: Total scans on that date
 */

const ScanHistorySchema = new Schema({
	date: { type: Date, required: true },
	totalScans: { type: Number, required: true },
})

/**
 * @swagger
 * components: 
 *  schemas: 
 *   User:
 *     type: object
 *     required:
 *       - id
 *     properties: 
 *       _id: 
 *         type: string
 *         description: MongoDB unique identifier
 *       id: 
 *         type: string
 *         unique: true
 *         immutable: true
 *         description: Browser unique identifier
 *       lastScanned: 
 *         type: string
 *         format: date-time
 *         default: null
 *         description: Date of the last scan
 *       timesScanned:
 *         type: number
 *         description: Total scans of the user
 *       scanHistory:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/ScanHistory'
 *         default: []
 *         description: Array of scan history
 *       name: 
 *        type: string
 *        description: User name
 *       surname:
 *        type: string
 *        description: User surname
 *       requests:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/Request'
 *        default: []
 *        description: Array of requests of the user
 */

const UserSchema = new Schema({

	id: { type: String, required: true, unique: true, immutable: true, },

	lastScanned: { type: Date, default: null, },

	timesScanned: { type: Number, default: 0, },

	scanHistory: { type: [ScanHistorySchema], default: [], },

	name: { type: String },

	surname: { type: String },

	requests: [{ type: Schema.Types.ObjectId, ref: 'Request', default: [] }]

});

const User = model('User', UserSchema);

export default User;