import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

import Admin from '../schemas/admin.schema.js';

passport.use(new LocalStrategy(
	async function (username, password, done) {
		try {
			const admin = await Admin.findOne({ username: username });
			if (!admin) { return done(null, false, { message: `Admin with username: ${username} not found` }); }
			bcrypt.compare(password, admin.password, function (err, isMatch) {
				if (err) { return done(err); }
				if (!isMatch) { return done(null, false, { message: "Incorrect password" }); }
				return done(null, admin);
			});
		} catch (err) {
			return done(err);
		}
	}
));

passport.serializeUser(function (admin, done) {
	done(null, admin._id);
});

passport.deserializeUser(async function (id, done) {
	try {
		const user = await Admin.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});