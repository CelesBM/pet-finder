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
  cloud_name: "ddaw8l94t", //luego process.env
  api_key: "148175273248443", //luego process.env
  api_secret: "MLgVqAAbXX5mAX6jS1L-EyFDAEE", //luego process.env
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
