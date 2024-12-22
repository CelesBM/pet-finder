import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "./connection";

export class Auth extends Model {}

Auth.init(
  {
    /*fullname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },*/
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "user_id",
    },
  },
  { sequelize, modelName: "auth" }
);
