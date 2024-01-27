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

describe("GET /products", () => {

	test("should return a 200 status code", async () => {
		const response = await request(app).get("/products");

		expect(response.statusCode).toBe(200);
	})

})


describe("POST /products", () => {

	describe("given a valid product", () => {

		test("should return a 201 status code", async () => {
			const product = {
				name: "Wood",
				price: 19.99,
			};

			const response = await request(app).post("/products")
				.field("name", product.name)
				.field("price", product.price)
				.attach("image", "public/test-image.jpg")

			expect(response.statusCode).toBe(201)
		})

	})

	describe("given an invalid product without image", () => {

		test("should return a 400 status code", async () => {
			const product = {
				name: "Wood",
				price: 19.99,
			};

			const response = await request(app).post("/products")
				.field("name", product.name)
				.field("price", product.price)

			expect(response.statusCode).toBe(400)
		})

	})

	describe("given an invalid product without name or price", () => {

		test("should return a 400 status code", async () => {
			const response = await request(app).post("/products")
				.attach("image", "public/test-image.jpg")

			expect(response.statusCode).toBe(400)
		})

	})

});