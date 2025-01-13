import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class User extends Model {}

User.init(
  {
    fullname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    localidad: { type: DataTypes.STRING },
    lat: { type: DataTypes.DECIMAL },
    long: { type: DataTypes.DECIMAL },
  },
  { sequelize, modelName: "user" }
);
