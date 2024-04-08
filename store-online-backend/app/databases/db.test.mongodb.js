const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const categoryModel = require("../models/category.model");
const { log } = require("../helpers");

// connection string
const connectString = `mongodb://localhost:27017/CloudZone-TEST`;

// singleton pattern
class Database {
    // constructor
    constructor() {
        this.connect();
    }
    // connect
    connect() {
        mongoose
            .connect(connectString, {
                maxPoolSize: 500,
            })
            //  success callback
            .then((_) => {
                log.yellow(`Connected database testing successfully !!!`);
                initial();
            })
            // error callback
            .catch((err) => console.log("Error Connect MongoDB: ", err));
    }

    // instance
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

// call instance function
const instanceMongodb = Database.getInstance();

// initial data (roles)
const initial = async () => {
    try {
        // check roles 'ADMIN' and 'MEMBER' exist
        const adminRole = await roleModel.findOne({ name: "ADMIN" });
        const memberRole = await roleModel.findOne({ name: "MEMBER" });
        // if not exist, create
        if (!adminRole) await roleModel.create({ name: "ADMIN" });
        if (!memberRole) await roleModel.create({ name: "MEMBER" });

        // check categories "UNCATEGORY"
        const unCategory = await categoryModel.findOne({ name: "UNCATEGORY" });
        // if not exist, create
        if (!unCategory) await categoryModel.create({ name: "UNCATEGORY" });
    } catch (error) {
        console.error("Error initializing roles:", error);
    }
};

module.exports = instanceMongodb;
