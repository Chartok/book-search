"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedBook = void 0;
var sequelize_1 = require("sequelize");
var index_1 = require("./index");
var User_1 = require("./User");
var Book_1 = require("./Book");
var SavedBook = /** @class */ (function (_super) {
    __extends(SavedBook, _super);
    function SavedBook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SavedBook;
}(sequelize_1.Model));
exports.SavedBook = SavedBook;
SavedBook.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    status: { type: sequelize_1.DataTypes.ENUM('NEXT', 'FINISHED'), allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    bookId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, {
    sequelize: index_1.sequelize,
    modelName: 'savedBook',
});
User_1.User.hasMany(SavedBook);
Book_1.Book.hasMany(SavedBook);
SavedBook.belongsTo(User_1.User);
SavedBook.belongsTo(Book_1.Book);
