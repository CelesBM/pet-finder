import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class Report extends Model {}

Report.init(
  {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    about: DataTypes.TEXT,
  },

  { sequelize, modelName: "report" }
);
