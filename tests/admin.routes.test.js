import request from 'supertest';
import app from "../src/index.js"
import mongoose from 'mongoose';

let server;

beforeAll((done) => {
	server = app.listen(0, () => {
		console.log(`Server running on port ${server.address().port}`);
		done();
	});
});

afterAll((done) => {
	server.close(() => {
		mongoose.connection.close();
		done();
	});
});

describe("Get /admins/:id", () => {

	const adminId = "65b4ccc9d83c5906fceb689e";

	describe("Get by id work alright", () => {

		test("Admin Id should exist", async () => {
			const response = await request(app).get(`/admins/${adminId}`).send()
			const returnedAdminId = response.body._id;

			expect(returnedAdminId).toBe(adminId)
		})

		test("Admin Id should not exist", async () => {
			const nonExistingAdminId = "123456789012345678901234";
			const response = await request(app).get(`/admins/${nonExistingAdminId}`).send()

			expect(response.statusCode).toBe(404)
		})

		test("Should return a 200 status code", async () => {
			const response = await request(app).get(`/admins/${adminId}`).send()

			expect(response.statusCode).toBe(200)
		})

	});

})

describe("POST /admins", () => {

	describe("Post admin work alright", () => {

		test("Should return a 400 status code if admin with such username already exist", async () => {
			const newAdmin = {
				username: "admin",
				password: "admin",
			}

			const response = await request(app).post("/admins").send(newAdmin)

			expect(response.statusCode).toBe(400)
		})

		test("Should create a new admin", async () => {
			const newAdmin = {
				username: `test-admin-${Date.now()}-${Math.random().toFixed(5)}`,
				password: "admin",
			}

			const response = await request(app).post("/admins").send(newAdmin)

			expect(response.statusCode).toBe(201)
		})

	})

})