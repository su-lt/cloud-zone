const mongoose = require("mongoose");
const roleModel = require("../models/role.model");

const {
    db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
mongoose
    .connect(connectString)
    .then((_) => {
        console.log("Connect MongoDB Successfully");
        // call initial function
        initial();
    })
    .catch((_) => {
        console.log("Connect MongoDB Failure !");
    });

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
