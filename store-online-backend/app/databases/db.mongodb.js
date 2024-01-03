const mongoose = require("mongoose");
const roleModel = require("../models/role.model");

const {
    db: { host, port, name },
} = require("../configs/mongodb.config");

const connectString = `mongodb://${host}:${port}/${name}`;

// singleton pattern
class Database {
    // constructor
    constructor() {
        this.connect();
    }
    // connect function
    connect() {
        mongoose
            .connect(connectString, {
                maxPoolSize: 500,
            })
            .then((_) => {
                console.log("Connected MongoDB Successfully");
                countConnect();
                initial();
            })
            .catch((err) => console.log("Error Connect MongoDB: ", err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
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

// count connections
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);

    return numConnections;
};

module.exports = instanceMongodb;
