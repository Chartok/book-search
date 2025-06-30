"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_URI, {
    dialect: 'mysql',
    logging: false,
});
