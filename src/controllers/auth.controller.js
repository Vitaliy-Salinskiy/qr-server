import jwt from 'jsonwebtoken';

export class AuthController {

	login(req, res) {
		try {
			const token = jwt.sign({ sub: req.user._id }, 'qr_jwt_token', { expiresIn: '7d' });

			res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
			res.status(200).json(token);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

}