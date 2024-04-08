const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const productModel = require("../app/models/product.model");
const mongoose = require("mongoose");

chai.use(chaiHttp);
const expect = chai.expect;

// account and access token admin
let accessToken = process.env.TEST_ACCESS_TOKEN;
let userId = process.env.TEST_USER_ID;

// CRUD Product API
describe("Test CRUD Product Restful API", () => {
    // create a new product
    describe("Create product", () => {
        it("should create a new product", async () => {
            const response = await chai
                .request(app)
                .post("/v1/api/product")
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({
                    name: "test-product",
                    price: 123,
                    quantity: 10,
                    category: new mongoose.Types.ObjectId(),
                    brand: "brand",
                    description: "description",
                });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.product.name).equal("test-product");
        });
    });

    // get all products
    describe("Get Products", () => {
        it("should get all products", async () => {
            const response = await chai.request(app).get("/v1/api/product");

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.products).to.be.an("array");
        });
    });

    // update a product
    describe("Update Product", () => {
        it("should update a product", async () => {
            // get a product
            const product = await productModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .put("/v1/api/product/" + product._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({
                    name: "test-product-update",
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                    brand: "brand",
                    description: "description",
                    productDetail: product.productDetail,
                    status: product.status,
                });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.product.name).equal(
                "test-product-update"
            );
        });
    });

    // delete a product
    describe("Delete product", () => {
        it("should deleta a product", async () => {
            const product = await productModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .delete("/v1/api/product/" + product._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
        });
    });
});
