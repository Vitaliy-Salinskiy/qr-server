import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';

import Admin from '../schemas/admin.schema.js';

passport.use(new LocalStrategy(
	async function (username, password, done) {
		try {
			const admin = await Admin.findOne({ username: username });
			if (!admin) { return done(null, false); }
			bcrypt.compare(password, admin.password, function (err, isMatch) {
				if (err) { return done(err); }
				if (!isMatch) { return done(null, false); }
				return done(null, admin);
			});
		} catch (err) {
			return done(err);
		}
	}
));