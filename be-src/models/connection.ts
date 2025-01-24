import { Error, Sequelize } from "sequelize";
import { v2 as cloudinary } from "cloudinary";
import algoliasearch from "algoliasearch";
import * as pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.SEQUELIZE_URL as string, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

//Conectar y autenticar con algolia:
const client = algoliasearch(
  process.env.ALGOLIA_ID as string,
  process.env.ALGOLIA_APIKEY as string
);

export const userDataAlgolia = client.initIndex("users");
export const petDataAlgolia = client.initIndex("pets");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos Neon.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });
