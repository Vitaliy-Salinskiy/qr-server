import { UserService } from '../services/user.service.js';

export class UserController {
	constructor() {
		this.userService = new UserService();
	}

	getUsers = async (req, res) => {
		try {
			const users = await this.userService.getUsers();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	getUser = async (req, res) => {
		try {
			const user = await this.userService.getUser(req.params.id);
			res.json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	createUser = async (req, res) => {
		try {
			const user = await this.userService.createUser(req.body);
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	updateUser = async (req, res) => {
		try {
			const user = await this.userService.updateUser(req.params.id);
			res.json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	addCredentials = async (req, res) => {
		try {
			const user = await this.userService.addCredentials(req.body.data, req.params.id);
			res.json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	getAllScans = async (req, res) => {
		try {
			const scans = await this.userService.getAllScans();
			res.json(scans);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
}