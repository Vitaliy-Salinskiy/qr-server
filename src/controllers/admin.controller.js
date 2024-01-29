import bcrypt from 'bcryptjs';

import Admin from "../schemas/admin.schema.js";

export class AdminController {

	async getAdmin(req, res) {
		try {
			if (!req.params.id) return res.status(400).json({ message: "No id provided" })

			const admin = await Admin.findById(req.params.id);

			if (!admin) return res.status(404).json({ message: "Admin not found" });

			res.status(200).json(admin);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async createAdmin(req, res) {
		try {

			const candidate = await Admin.findOne({ username: req.body.username });

			if (candidate) {
				return res.status(400).json({ message: "Username already exists" });
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);


			const admin = await new Admin({ username: req.body.username, password: hashedPassword }).save();
			res.status(201).json(admin);
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}

}