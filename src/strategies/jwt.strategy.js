import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Admin from '../schemas/admin.schema.js';

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['qr_jwt_token'];
	}
	return token;
}

const opts = {
	jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
	secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
	try {
		const admin = await Admin.findById(jwt_payload.sub);
		if (admin) {
			return done(null, admin);
		} else {
			return done(null, false);
		}
	} catch (err) {
		return done(err, false);
	}
}));