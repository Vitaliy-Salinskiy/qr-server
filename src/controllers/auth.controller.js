import jwt from 'jsonwebtoken';

export class AuthController {

	login(req, res) {
		console.log(req)
		console.log(res)

		try {
			const token = jwt.sign({ sub: req.user._id }, 'qr_jwt_token', { expiresIn: '7d' });
			
			res.cookie('qr_jwt_token', token, { httpOnly: true, secure: true, maxAge: process.env.TOKEN_MAX_AGE });
			res.status(200).json(token);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

}