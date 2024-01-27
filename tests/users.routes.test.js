import request from "supertest"
import app from "../src/index.js"
import mongoose from "mongoose"

let server;

beforeAll((done) => {
	server = app.listen(0, () => {
		console.log(`Server running on port ${server.address().port}`)
		done()
	})
})

afterAll((done) => {
	server.close(() => {
		mongoose.connection.close()
		done()
	})
})

describe("GET /users", () => {

	test("should return a 200 status code", async () => {
		const response = await request(app).get("/users")

		expect(response.statusCode).toBe(200)
	})

})

describe("GET /users/scans", () => {

	test("should return a 200 status code", async () => {
		const response = await request(app).get("/users/scans")

		expect(response.statusCode).toBe(200)
	})

})

describe("GET /users/{id}", () => {
	const userId = "9c46814aaf58f43eb1ad1bbc94c63e81"

	describe("Get by browser id work alright", () => {

		test("Should return a 200 status code", async () => {
			const response = await request(app).get(`/users/${userId}`)
			expect(response.statusCode).toBe(200)
		})

		test("User Id should exist", async () => {
			const response = await request(app).get(`/users/${userId}`)
			const returnedUserId = response.body.id

			expect(returnedUserId).toBe(userId)
		})

		test("User Id should not exist", async () => {
			const nonExistingUserId = "123456789012345678901234";
			const response = await request(app).get(`/users/${nonExistingUserId}`).send()

			expect(response.statusCode).toBe(404)
		})

	})

})

describe("POST /users", () => {

	describe("Post user work alright", () => {

		test("Should return a message: 'You Back!!!' if user with such browserId already exist", async () => {
			const newUser = {
				id: `9c46814aaf58f43eb1ad1bbc94c63e81`,
			}

			const response = await request(app).post("/users").send(newUser)

			expect(response.body.message).toBe("You Back!!!")
		})

		test("Should create a new user", async () => {
			const newUser = {
				id: `test-user-id-${Date.now()}-${Math.random().toFixed(5)}`,
			}

			const response = await request(app).post("/users").send(newUser)

			expect(response.statusCode).toBe(201)
		})

	})

})

describe("PUT /users/{id}", () => {
	test("Should return a 400 status code if admin with such username already exist", async () => {
		const userId = "1234567890"

		const response = await request(app).post(`/users/${userId}`)

		expect(response.statusCode).toBe(404)
	})

})

describe("PUT /users/{id}/credentials", () => {

	test("Should return a 400 status code if admin with such username already exist", async () => {
		const userId = "1234567890"

		const response = await request(app).post(`/users/${userId}/credentials`)

		expect(response.statusCode).toBe(404)
	})

})