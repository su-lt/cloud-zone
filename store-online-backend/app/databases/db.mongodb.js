const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const {
    db: { host, port, name },
} = require("../configs");
const { log } = require("../helpers");

// connection string
const connectString = `mongodb://${host}:${port}/${name}`;

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
                log.blue(`Connected MongoDB Successfully on port: ${port}`);
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
    } catch (error) {
        console.error("Error initializing roles:", error);
    }
};

module.exports = instanceMongodb;
