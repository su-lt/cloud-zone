const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const userModel = require("../app/models/user.model");

chai.use(chaiHttp);
const expect = chai.expect;

// account and access token admin
let accessToken = process.env.TEST_ACCESS_TOKEN;
let userId = process.env.TEST_USER_ID;

// CRUD User API
describe("Test CRUD User Restful API", () => {
    // create a new user
    describe("Create user", () => {
        it("should create a new user", async () => {
            const response = await chai
                .request(app)
                .post("/v1/api/user")
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({
                    fullname: "Test-User",
                    email: "test@gmail.com",
                    phone: "0901234567",
                    password: "123",
                    address: "01 test",
                });
            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.user.email).equal("test@gmail.com");
        });
    });

    // get all users
    describe("Get Users", () => {
        it("should get all users", async () => {
            const response = await chai
                .request(app)
                .get("/v1/api/user")
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.users).to.be.an("array");
        });
    });

    // update a user
    describe("Update User", () => {
        it("should update a user", async () => {
            // get a user
            const user = await userModel.findOne({
                email: "test@gmail.com",
            });

            const response = await chai
                .request(app)
                .post("/v1/api/user/" + user._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({ role: user.role, status: "inactive" });

            expect(response.body).to.have.property("status").equal("success");
        });
    });

    // delete a user
    describe("Delete User", () => {
        it("should deleta a user", async () => {
            const user = await userModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .delete("/v1/api/user/" + user._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
        });
    });

    after(async () => {
        // delete newest category
        await userModel.findOneAndDelete({}, { sort: { _id: -1 } });
    });
});
