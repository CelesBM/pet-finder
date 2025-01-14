import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class Pet extends Model {}

Pet.init(
  {
    name: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    long: DataTypes.DECIMAL,
    location: DataTypes.STRING,
  },

  { sequelize, modelName: "pet" }
);
