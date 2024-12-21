import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { sequelize } from "./models/connection";
import { User } from "./models/users";
import { Auth } from "./models/auth";

const app = express();
const port = 4000; // luego agregar el process.env.PORT || 3000
const SECRET = "HJAFDHNAJKFBWIE";

app.use(express.json());
app.use(cors());

function getSHA256fromSTRING(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

//sequelize.sync({ force: true }).then(() => {
//  console.log("Base de datos sincronizada");
app.listen(port, () => {
  console.log("Listening on port", port);
});
//});

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const [user, created] = await User.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      email,
      password,
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      email,
      password: getSHA256fromSTRING(req.body.password),
      user_id: user.get("id"),
    },
  });
  console.log({ authCreated, auth });
  res.json(user);
});

app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const passwordHasheado = getSHA256fromSTRING(password);
  const auth = await Auth.findOne({
    where: {
      email,
      password: passwordHasheado,
    },
  });
  if (auth) {
    const token = jwt.sign({ id: auth.get("user_id") }, SECRET);
    res.json({ token });
  } else {
    res.status(400).json({ error: "email o password incorrecto." });
  }
});

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: true }); // Se envía la respuesta, pero no se retorna
    return; // Finaliza el flujo del middleware sin retornar un valor
  }

  const token = authHeader.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET); // Verificación del token
    (req as any)._user = data;
    next(); // Llamamos a next() para pasar al siguiente middleware
  } catch (e) {
    res.status(401).json({ error: true }); // Responder en caso de error
    return; // Finaliza el flujo sin retornar
  }
}

app.get("/me", authMiddleware, async (req, res) => {
  //console.log((req as any)._user);
  const user = await User.findByPk((req as any)._user.id);
  res.json(user);
});

/* ESTO FUNCIONABA PERO NO TRAE LO DEL FRONT DE FE-SRC
app.get("*", function (req, res) {
  const file = path.resolve(__dirname, "../dist/index.html"); //pet-finder\dist\index.html
  res.sendFile(file);
});*/

//pruebo lo nuevo:
const staticDirPath = path.resolve(__dirname, "../dist");

// Configura Express para servir archivos estáticos
app.use(express.static(staticDirPath));

// Responde con el archivo `index.html` solo para las rutas que no sean de recursos estáticos
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDirPath, "index.html"));
});
