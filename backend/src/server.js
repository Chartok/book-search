"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var cors_1 = require("cors");
var models_1 = require("./models");
var auth_1 = require("./routes/auth");
var books_1 = require("./routes/books");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/books', books_1.default);
models_1.sequelize
    .sync()
    .then(function () {
    console.log('✅ DB Synced');
    app.listen(PORT, function () {
        console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
    });
})
    .catch(console.error);
