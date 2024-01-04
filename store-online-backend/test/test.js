const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const productModel = require("../app/models/product.model");
const voucherModel = require("../app/models/voucher.model");
const should = chai.should();

chai.use(chaiHttp);

// category
describe("Test CRUD Category Restful API", () => {
    // test get all categories
    describe("/GET/ - Get all", () => {
        it("Returns all categories must be array", (done) => {
            chai.request(app)
                .get("/v1/api/category")
                .end((err, res) => {
                    res.should.status(200);
                    res.body.should.have.property("metadata");

                    const categories = res.body.metadata.categories;
                    categories.should.be.a("array");
                    done();
                });
        });
    });
});

// product
describe("Test CRUD Products Restful API", () => {
    // test get all products
    describe("/GET/ - Get all", () => {
        it("Returns all products must be array", (done) => {
            chai.request(app)
                .get("/v1/api/product")
                .end((err, res) => {
                    res.should.status(200);
                    res.body.should.have.property("metadata");

                    const products = res.body.metadata.products;
                    products.should.be.a("array");
                    done();
                });
        });
    });

    // test get product by id
    describe("/GET/:id - Get one", () => {
        after(async () => {
            // delete newest product
            await productModel.findOneAndDelete({}, { sort: { _id: -1 } });
        });
        // create new product
        before(async () => {
            await productModel.create({
                name: "product-test",
                slug: "product-test",
                price: 100,
            });
        });

        it("should retrieve a course by its ID", async () => {
            const found = await productModel.findOne().sort({ _id: -1 });
            const res = await chai
                .request(app)
                .get("/v1/api/product/" + found._id);

            res.should.have.status(200);
            const product = res.body.metadata.product;
            product.should.have.property("_id").eql(found._id.toString());
        });
    });

    // test get product by slug
    describe("/GET/:slug - Get one", () => {
        after(async () => {
            // delete newest product
            await productModel.findOneAndDelete({}, { sort: { _id: -1 } });
        });
        // create new product
        before(async () => {
            await productModel.create({
                name: "product-test",
                slug: "product-test",
                price: 100,
            });
        });

        it("should retrieve a course by slug", async () => {
            const found = await productModel.findOne().sort({ _id: -1 });
            const res = await chai
                .request(app)
                .get("/v1/api/product/slug/" + found.slug);

            res.should.have.status(200);
            const product = res.body.metadata.product;
            product.should.have.property("_id").eql(found._id.toString());
        });
    });

    // test get related products by category id
    describe("POST/related/:id - Get products", () => {
        it("should return products must be array", async () => {
            const found = await productModel.findOne();
            const res = await chai
                .request(app)
                .post("/v1/api/product/related/" + found.category);

            res.should.have.status(200);
            const products = res.body.metadata.relatedProducts;
            products.should.be.a("array");
        });
    });

    // test get total products
    describe("/GET/ - get number", () => {
        it("should retrieve a total number of products", async () => {
            const res = await chai
                .request(app)
                .get("/v1/api/product/totalProducts/");

            res.should.have.status(200);
            const count = res.body.metadata.count;
            count.should.be.a("number");
        });
    });
});

// voucher
describe("Test CRUD Voucher Restful API", () => {
    describe("/GET/:code - Get one", () => {
        after(async () => {
            // delete newest product
            await voucherModel.findOneAndDelete({}, { sort: { _id: -1 } });
        });
        // create new product
        before(async () => {
            await voucherModel.create({
                code: "123qwerty",
            });
        });

        it("should retrieve a voucher by code", async () => {
            const found = await voucherModel.findOne().sort({ _id: -1 });

            const res = await chai
                .request(app)
                .get("/v1/api/voucher/" + found.code);

            res.should.have.status(200);
            const voucher = res.body.metadata.voucher;
            voucher.should.have.property("_id").eql(found._id.toString());
        });
    });
});
