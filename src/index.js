import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import { join, dirname } from 'path';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import requestRoutes from './routes/request.routes.js';

import './strategies/local.strategy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/admins', adminRoutes);
app.use('/auth', authRoutes);
app.use('/requests', requestRoutes);

app.use('/uploads', express.static('uploads', {
	maxAge: '1d'
}));

const bootstrap = () => {
	try {
		mongoose.connect(process.env.MONGO_URL)

		app.listen(port, () => console.log(`Server running on port ${port}`));
	} catch (error) {
		console.log(error);
	}
}

bootstrap();