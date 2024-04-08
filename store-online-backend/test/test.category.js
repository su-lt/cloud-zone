const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const categoryModel = require("../app/models/category.model");

chai.use(chaiHttp);
const expect = chai.expect;

// account and access token admin
let accessToken = process.env.TEST_ACCESS_TOKEN;
let userId = process.env.TEST_USER_ID;

// CRUD Category API
describe("Test CRUD Category Restful API", () => {
    // create a new category
    describe("Create Category", () => {
        it("should create a new category", async () => {
            const response = await chai
                .request(app)
                .post("/v1/api/category")
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({ name: "Test-Category" });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
        });
    });

    // get all categories
    describe("Get Categories", () => {
        it("should get all categories", async () => {
            const response = await chai.request(app).get("/v1/api/category");

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.categories).to.be.an("array");
        });
    });

    // update a category
    describe("Update Category", () => {
        it("should update a category", async () => {
            // get a category
            const category = await categoryModel.findOne({
                name: "Test-Category",
            });

            const response = await chai
                .request(app)
                .post("/v1/api/category/" + category._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({ name: "Test-Category-Update" });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.category.name).equal(
                "Test-Category-Update"
            );
        });
    });

    // delete a category
    describe("Delete Category", () => {
        it("should deleta a category", async () => {
            const category = await categoryModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .delete("/v1/api/category/" + category._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
        });
    });

    after(async () => {
        // delete newest category
        await categoryModel.findOneAndDelete({}, { sort: { _id: -1 } });
    });
});
