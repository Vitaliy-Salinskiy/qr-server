import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';

import './strategies/local.strategy.js';
import Admin from './schemas/admin.schema.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(session({
	secret: 'adapter',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

const bootstrap = () => {
	try {
		mongoose.connect(process.env.MONGO_URL)

		app.listen(port, () => console.log(`Server running on port ${port}`));
	} catch (error) {
		console.log(error);
	}
}

bootstrap();