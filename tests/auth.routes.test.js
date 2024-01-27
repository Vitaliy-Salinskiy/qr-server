import request from "supertest";
import app from "../src/index.js";
import mongoose from "mongoose";

let server;

beforeAll((done) => {
	server = app.listen(0, () => {
		console.log(`Server running on port ${server.address().port}`);
		done();
	})
})

afterAll((done) => {
	server.close(() => {
		mongoose.connection.close();
		done();
	})
})

describe("POST /auth/login", () => {

	describe("given a valid username and password", () => {

		test("should return a 200 status code", async () => {
			const admin = {
				username: "admin",
				password: "admin",
			};

			const response = await request(app).post("/auth/login").send(admin)

			expect(response.statusCode).toBe(200)
		})
	})


	describe("given a invalid username or password", () => {

		test("should return a 401 status code", async () => {
			const admin = {
				username: "qwerty123",
				password: "admin123",
			};

			const response = await request(app).post("/auth/login").send(admin)

			expect(response.statusCode).toBe(401)
		})
	})

})