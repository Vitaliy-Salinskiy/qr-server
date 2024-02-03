import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
import { v4 as uuid } from 'uuid';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import requestRoutes from './routes/request.routes.js';

import './strategies/local.strategy.js';
import './strategies/jwt.strategy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'QR Backend',
			version: '1.0.0',
			description: 'QR Backend API'
		},
	},
	apis: ['./src/routes/*.js', './src/schemas/*.js'],
}

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors({
	origin: true,
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

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

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/tmp/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, uuid() + '-' + Date.now())
	}
})

const upload = multer({ storage: storage })

app.use('/uploads', express.static('/tmp/uploads'));

const bootstrap = () => {
	try {
		mongoose.connect(process.env.MONGO_URL)

		app.listen(port, () => console.log(`Server running on port ${port}`));
	} catch (error) {
		console.log(error);
	}
}

bootstrap();

export default app;