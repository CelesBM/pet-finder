import { Sequelize } from "sequelize";
import * as pg from "pg";

export const sequelize = new Sequelize(
  "postgresql://neondb_owner:eD9tyRhqiVT0@ep-silent-king-a5mi39y1.us-east-2.aws.neon.tech/neondb?sslmode=require",
  {
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos Neon.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });
