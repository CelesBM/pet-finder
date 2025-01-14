import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { sequelize } from "./models/connection";
import { User } from "./models/users";
import { Auth } from "./models/auth";
import {
  authUser,
  authToken,
  authMiddleware,
  getUser,
  loginUser,
} from "./controllers/auth-controller";
import { updateUserData } from "./controllers/users-controller";
import { emitWarning } from "process";

const app = express();
const port = 4000; // luego agregar el process.env.PORT || 4000
const SECRET = "HJAFDHNAJKFBWIE";

//Middleware para configurar los headers para permitir CORS:
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next(); //llama al siguiente middleware o controlador de la ruta
});

app.use(express.json());

//Middleware para agregar los encabezados necesarios en las respuestas HTTP, para permitir solicitudes entre diferentes dominios:
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

sequelize.sync({ force: true }).then(() => {
  //console.log("Base de datos sincronizada");
  app.listen(port, () => {
    console.log("Listening on port", port);
  });
});

app.post("/auth", async (req, res): Promise<void> => {
  try {
    if (req.body) {
      const user = await authUser(req.body);
      if (typeof user === "string") {
        res.status(400).json({ error: user });
      }
      res.json(user);
    } else {
      res.status(400).json({ error: "Error de userData en auth-controller" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/auth/token", async (req, res): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ error: "No se ingresaron datos al body." });
  }
  const tokenResponse = await authToken(req.body);
  if (tokenResponse.error) {
    res.status(400).json({ error: tokenResponse.error });
  }
  res.json(tokenResponse);
});

//antes era app.get
app.use(
  "/me",
  authMiddleware,
  (req: Request & { userauth?: any }, res: Response) => {
    if (req.userauth) {
      res.json({ user: req.userauth });
    } else {
      res.status(401).json({ error: "No autorizado." });
    }
  }
);

app.post("/me", async (req, res) => {
  try {
    const userFound = await getUser(req);
    res.json(userFound);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  if (req.body.email) {
    const user = await loginUser(req.body);
    res.json(user);
  } else {
    res.status(400).json("Body vacio");
  }
});

app.post("/update-personal", async (req, res) => {
  try {
    if (req.body.userId) {
      const updatedUser = await updateUserData(req.body);
      res.json(updatedUser); //devuelve datos actualizados
    } else {
      res.status(400).json({ error: "No se registra userId" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const staticDirPath = path.resolve(__dirname, "../dist");
app.use(express.static(staticDirPath)); //configuración Express para servir archivos estáticos
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDirPath, "index.html")); //responde con el archivo `index.html` solo para las rutas que no sean de recursos estáticos
});
