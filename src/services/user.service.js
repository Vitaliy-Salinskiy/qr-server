import User from '../schemas/user.schema.js';

export class UserService {

	async getUsers() {
		try {
			const users = await User.find().populate('requests').exec();
			return users;
		} catch (error) {
			throw error;
		}
	}

	async getUser(id) {
		try {
			const user = await User.findOne({ id: id }).exec();

			return user;
		} catch (error) {
			throw error;
		}
	}

	async createUser(user) {
		try {
			const existingUser = await User.findOne({ id: user.id });

			if (existingUser) {
				return { message: 'You Back!!!' }
			}
			const createdUser = new User(user).save();

			return createdUser;
		} catch (error) {
			throw error;
		}
	}

	async updateUser(userId) {
		try {
			const updatedUser = await User.findOne({ id: userId });

			if (!updatedUser) {
				throw new Error('User not found');
			}

			const lastScannedDate = updatedUser.lastScanned ? updatedUser.lastScanned.toISOString().split('T')[0] : null;
			const currentDate = new Date().toISOString().split('T')[0];

			if (lastScannedDate === currentDate) {
				return { message: 'You have already scanned today' };
			}

			if (lastScannedDate && currentDate <= lastScannedDate) {
				throw new Error('The new date must be later than the last scanned date');
			}

			const newScan = {
				date: new Date(),
				totalScans: updatedUser.timesScanned + 1
			}

			updatedUser.scanHistory.push(newScan);

			updatedUser.lastScanned = new Date();
			updatedUser.timesScanned++;
			await updatedUser.save();

			return updatedUser;
		} catch (error) {
			throw error;
		}
	}

	async addCredentials(data, id) {
		try {
			const user = await User.findOneAndUpdate({ id: id }, data, { new: true });

			if (!user) {
				throw new Error('No users found');
			}

			return user;
		} catch (error) {
			throw error;
		}
	}

	async getAllScans() {
		try {
			const users = await User.find({ lastScanned: { $ne: null } });
			if (!users) {
				return 0;
			}
			const scans = users.reduce((acc, user) => acc + user.timesScanned, 0);
			return scans;
		} catch (error) {
			throw error;
		}
	}

}