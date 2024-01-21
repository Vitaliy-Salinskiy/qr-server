import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);

const bootstrap = () => {
	try {
		mongoose.connect(process.env.MONGO_URL)

		app.listen(port, () => console.log(`Server running on port ${port}`));
	} catch (error) {
		console.log(error);
	}
}

bootstrap();