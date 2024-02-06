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
 *         example: 65b09a2afd9a1b910c069814
 *         description: MongoDB unique identifier
 *       id: 
 *         type: string
 *         unique: true
 *         immutable: true
 *         example: 9c46814aaf58f43eb1ad1bbc94c63e81
 *         description: Browser unique identifier
 *       lastScanned: 
 *         type: string
 *         format: date-time
 *         example: 2024-01-24T05:04:12.755+00:00
 *         default: null
 *         description: Date of the last scan
 *       wheelSpinDate: 
 *         type: string
 *         format: date-time
 *         example: 2024-01-24T05:04:12.755+00:00
 *         default: null
 *         description: Date of the last scan
 *       timesScanned:
 *         type: number
 *         example: 32
 *         description: Total scans of the user
 *       scanHistory:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/ScanHistory'
 *         default: []
 *         example: 
 *           _id: 65b09a4cfd9a1b910c06981c
 *           date: 2024-01-24T05:04:12.755+00:00
 *           totalScans: 12
 *         description: Array of scan history
 *       name: 
 *        type: string
 *        example: John
 *        description: User name
 *       surname:
 *        type: string
 *        example: Doe
 *        description: User surname
 *       requests:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Request'
 *        default: []
 *        description: Array of requests of the user
 *        example: 
 *         _id: 65b09af1fd9a1b910c06986b
 *         userId: 65b09a2afd9a1b910c069814
 *         productId: 65afcd27775bea5debb91833
 *         status: pending
 *         createdAt: 2024-01-24T05:04:12.755+00:00
 *         updatedAt: 2024-01-24T05:05:12.755+00:00
 */

const UserSchema = new Schema({

	id: { type: String, required: true, unique: true, immutable: true, },

	lastScanned: { type: Date, default: null, },

	timesScanned: { type: Number, default: 0, },

	wheelSpinDate: { type: Date, default: null, },

	scanHistory: { type: [ScanHistorySchema], default: [], },

	name: { type: String },

	surname: { type: String },

	requests: [{ type: Schema.Types.ObjectId, ref: 'Request', default: [] }]

});

const User = model('User', UserSchema);

export default User;