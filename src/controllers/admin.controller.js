import Admin from "../schemas/admin.schema.js";
import bcrypt from 'bcryptjs';

export class AdminController {

	async getAdmin(req, res) {
		try {
			const admin = await Admin.findById(req.params.id);
			res.status(200).json(admin);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async createAdmin(req, res) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

			const admin = await new Admin({ username: req.body.username, password: hashedPassword }).save();
			res.status(201).json(admin);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

}