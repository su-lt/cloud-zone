const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const productModel = require("../app/models/product.model");
const orderModel = require("../app/models/order.model");

chai.use(chaiHttp);
const expect = chai.expect;

// account and access token admin
let accessToken = process.env.TEST_ACCESS_TOKEN;
let userId = process.env.TEST_USER_ID;

// CRUD Order API
describe("Test CRUD Order Restful API", () => {
    // create product
    before(async () => {
        await productModel.create({
            name: "product",
            price: 10,
            quantity: 10,
            brand: "brand",
            description: "description",
        });
    });

    // create product
    after(async () => {
        await productModel.findOneAndDelete();
    });

    // create a new order
    describe("Create order", () => {
        it("should create a new order", async () => {
            const product = await productModel.findOne();

            const response = await chai
                .request(app)
                .post("/v1/api/order")
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({
                    user: userId,
                    address: "address",
                    items: [
                        {
                            product: product._id,
                            quantity: 1,
                            price: 10,
                        },
                    ],
                    totalPrice: 10,
                });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
        });
    });

    // get all orders
    describe("Get Orders", () => {
        it("should get all orders", async () => {
            const response = await chai
                .request(app)
                .get("/v1/api/order")
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.orders).to.be.an("array");
        });
    });

    // update a order
    describe("Update Order", () => {
        it("should update a order", async () => {
            // get a order
            const order = await orderModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .patch("/v1/api/order/" + order._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({ status: "processing" });

            expect(response.body).to.have.property("status").equal("success");
        });
    });

    // delete a order
    describe("Delete Order", () => {
        it("should deleta a order", async () => {
            const order = await orderModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .delete("/v1/api/order/" + order._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
        });
    });
});
