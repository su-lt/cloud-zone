const app = require("../server");
const sinon = require("sinon");
// const categoryModel = require("../app/models/category.model");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const authMiddleware = require("../app/middlewares/auth.middleware");

chai.use(chaiHttp);
const { expect } = chai;

describe("Test CRUD Category Restful API", () => {
    // test create category
    describe("/POST/ - Create", () => {
        it("should create a new category", (done) => {
            const data = {
                name: "category test",
            };

            const authenticationStub = sinon.stub(
                authMiddleware,
                "authentication"
            );
            const isAdminStub = sinon.stub(authMiddleware, "isAdmin");

            // Thiết lập giả mạo cho authentication middleware
            authenticationStub.callsFake((req, res, next) => {
                next();
            });

            // Thiết lập giả mạo cho isAdmin middleware
            isAdminStub.callsFake((req, res, next) => {
                // Cho phép bất kỳ user nào có quyền 'ADMIN'
                next();
            });

            // Kiểm tra giả mạo có được gọi hay không
            expect(authenticationStub.calledOnce).to.be.true;
            expect(isAdminStub.calledOnce).to.be.true;

            chai.request(app)
                .post("/v1/api/category")
                .send(data)
                .end((err, res) => {
                    console.log(":::::::::::::::::::::: 234");
                    res.should.have.status(201);
                    // Kiểm tra dữ liệu được tạo
                    res.body.should.have.property("message").equal("success");
                    res.body.should.have.property("metadata");
                    res.body.metadata.should.have.property("category");
                    const category = res.body.metadata.category;
                    category.should.have
                        .property("name")
                        .equal("category test");
                    done();
                });
        });

        afterEach(() => {
            // Tránh tình trạng giả mạo lan sang các bài kiểm tra khác
            sinon.restore();
        });
    });

    // describe("/GET/ - Get all", () => {
    //     it("Returns all courses must be array", (done) => {
    //         chai.request(app)
    //             .get("/api/v1/courses")
    //             .end((err, res) => {
    //                 res.status.should.eql(200);
    //                 res.body.data.should.be.a("array");
    //                 done();
    //             });
    //     });
    // });

    // describe("/GET/:id - Get one", () => {
    //     it("should retrieve a course by its ID", async () => {
    //         let course = await courseModel.create({
    //             title: "Ten",
    //             description: "Mo ta",
    //             noStudent: 10,
    //         });

    //         const res = await chai
    //             .request(app)
    //             .get("/api/v1/courses/" + course._id);

    //         res.should.have.status(200);
    //         res.body.should.be.a("object");
    //         res.body.should.have.property("data");

    //         const courseData = res.body.data;
    //         courseData.should.have.property("title").eql("Ten");
    //         courseData.should.have.property("description").eql("Mo ta");
    //         courseData.should.have.property("noStudent").eql(10);
    //         courseData.should.have.property("_id").eql(course._id.toString());
    //     });
    // });

    // describe("/PUT/:id - Update one", () => {
    //     it("should update a course by its ID", async () => {
    //         let course = await courseModel.create({
    //             title: "Ten 1",
    //             description: "Mo ta",
    //             noStudent: 10,
    //         });

    //         const res = await chai
    //             .request(app)
    //             .put("/api/v1/courses/" + course._id)
    //             .send({
    //                 reqDescription: "Mo ta 1",
    //                 reqStudent: 11,
    //             });
    //         res.should.have.status(200);
    //         res.body.should.be.a("object");
    //         res.body.should.have.property("data");

    //         const courseData = res.body.data;
    //         courseData.should.have.property("description").eql("Mo ta 1");
    //         courseData.should.have.property("noStudent").eql(11);
    //         courseData.should.have.property("_id").eql(course._id.toString());
    //     });
    // });

    // describe("/DELETE/:id - Update one", () => {
    //     it("should update a course by its ID", async () => {
    //         let course = await courseModel.create({
    //             title: "Ten 2",
    //             description: "Mo ta",
    //             noStudent: 10,
    //         });

    //         const res = await chai
    //             .request(app)
    //             .delete("/api/v1/courses/" + course._id);

    //         res.should.have.status(200);
    //         res.body.should.be.a("object");
    //     });
    // });
});
