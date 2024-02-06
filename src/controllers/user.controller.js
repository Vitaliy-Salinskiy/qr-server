import User from '../schemas/user.schema.js';
import { UserService } from '../services/user.service.js';

export class UserController {
	constructor() {
		this.userService = new UserService();
	}

	getUsers = async (req, res) => {
		try {
			const users = await this.userService.getUsers();
			return res.status(200).json(users);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	};

	getUser = async (req, res) => {
		try {
			if (!req.params.id) {
				return res.status(400).json({ message: "Bad request" });
			}

			const user = await this.userService.getUser(req.params.id);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	createUser = async (req, res) => {
		try {
			const user = await this.userService.createUser(req.body);
			return res.status(201).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	updateUser = async (req, res) => {
		try {
			if (!req.params.id) {
				return res.status(400).json({ message: "Bad request" });
			}

			const user = await this.userService.updateUser(req.params.id);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	};

	addScansByPrize = async (req, res) => {
		try {
			 if (!req.params.id || !req.body.prize) return res.status(400).json({ message: "Bad request" });
  
			 const user = await User.findOne({ id: req.params.id });
			 
			 if (!user) return res.status(404).json({ message: "User not found" });
			 
			 const dayLimit = process.env.SPIN_LIMIT;
			 const lastScannedDate = user.wheelSpinDate ? new Date(user.wheelSpinDate.toISOString().split('T')[0]) : null;
  
			 const daysAgo = new Date();
			 daysAgo.setDate(daysAgo.getDate() - dayLimit);
  
			 if (lastScannedDate !== null && lastScannedDate >= daysAgo) {
				  return res.status(400).json({ message: `You have already scanned in the last ${dayLimit} days` });
			 }
  
			 user.timesScanned += req.body.prize;
			 user.wheelSpinDate = new Date();
			 await user.save();
  
			 return res.status(200).json({ user });
		} catch (error) {
			 return res.status(500).json({ message: error.message });
		}
  }

	addCredentials = async (req, res) => {
		try {

			if (!req.params.id || !req.body.data) return res.status(400).json({ message: "Bad request" });

			const user = await this.userService.addCredentials(req.body.data, req.params.id);

			return res.status(200).json({ user });
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	};

	getAllScans = async (req, res) => {
		try {
			const scans = await this.userService.getAllScans();
			return res.json(scans);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	};
}