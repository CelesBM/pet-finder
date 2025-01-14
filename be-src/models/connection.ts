import { Error, Sequelize } from "sequelize";
import * as pg from "pg";
import algoliasearch from "algoliasearch";
import * as dotenv from "dotenv";
dotenv.config();
//postgresql://neondb_owner:eD9tyRhqiVT0@ep-silent-king-a5mi39y1.us-east-2.aws.neon.tech/neondb?sslmode=require   process.env.SEQUELIZE_URL as string
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

/*async function testAlgolia() {
  try {
    const responseSave = await userDataAlgolia.saveObject({
      objectID: "test-id",
      fullname: "Test User",
      email: "test@example.com",
      localidad: "Test City",
    });
    console.log("Escritura exitosa en Algolia:", responseSave);

    const responseSearch = await userDataAlgolia.search("Test User");
    console.log("Búsqueda exitosa en Algolia:", responseSearch.hits);
  } catch (error) {
    console.error("Error al interactuar con Algolia:", error);
  }
}

testAlgolia();*/
/*
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
*/

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión exitosa a la base de datos Neon.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });
