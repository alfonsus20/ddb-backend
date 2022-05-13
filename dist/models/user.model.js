"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const article_model_1 = __importDefault(require("./article.model"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    majority: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    entryYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    graduationYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    thesisURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    profileImageURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isAdmin: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    isVerified: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: db_1.default,
    tableName: "users",
});
User.prototype.toJSON = function () {
    const attributes = Object.assign({}, this.get());
    delete attributes["password"];
    return attributes;
};
User.hasMany(article_model_1.default, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "articles",
});
article_model_1.default.belongsTo(User, { as: "user", foreignKey: "userId" });
exports.default = User;
