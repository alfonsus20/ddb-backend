import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare majority: string;
  declare entryYear: number;
  declare graduationYear?: number;
  declare thesisURL?: string;
  declare profileImageURL?: string;
  declare isAdmin?: boolean;
  declare isVerified?: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    majority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entryYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thesisURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImageURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "users" }
);

export default User;
