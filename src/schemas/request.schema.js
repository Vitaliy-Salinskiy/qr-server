import { Schema, model } from "mongoose";

const requestSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
})

const Request = model("Request", requestSchema);

export default Request;