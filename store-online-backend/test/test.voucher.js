const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const voucherModel = require("../app/models/voucher.model");

chai.use(chaiHttp);
const expect = chai.expect;

// account and access token admin
let accessToken = process.env.TEST_ACCESS_TOKEN;
let userId = process.env.TEST_USER_ID;

// CRUD Voucher API
describe("Test CRUD Voucher Restful API", () => {
    // create a new voucher
    describe("Create voucher", () => {
        it("should create a new voucher", async () => {
            const response = await chai
                .request(app)
                .post("/v1/api/voucher")
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({
                    discount: "10",
                });

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.voucher.discount).equal(10);
        });
    });

    // get all vouchers
    describe("Get Vouchers", () => {
        it("should get all vouchers", async () => {
            const response = await chai
                .request(app)
                .get("/v1/api/voucher")
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
            expect(response.body).to.have.property("metadata");
            expect(response.body.metadata.vouchers).to.be.an("array");
        });
    });

    // update a voucher
    describe("Update Voucher", () => {
        it("should update a voucher", async () => {
            // get a voucher
            const voucher = await voucherModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .post("/v1/api/voucher/" + voucher._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken)
                .send({ status: "expired" });

            expect(response.body).to.have.property("status").equal("success");
        });
    });

    // delete a voucher
    describe("Delete Voucher", () => {
        it("should deleta a voucher", async () => {
            const voucher = await voucherModel.findOne().sort({ _id: -1 });

            const response = await chai
                .request(app)
                .delete("/v1/api/voucher/" + voucher._id)
                .set("x-client-id", userId)
                .set("x-token", accessToken);

            expect(response.body).to.have.property("status").equal("success");
        });
    });
});
