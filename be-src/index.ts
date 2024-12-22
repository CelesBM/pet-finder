import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { sequelize } from "./models/connection";
import { User } from "./models/users";
import { Auth } from "./models/auth";
import { authUser, authToken } from "./controllers/auth-controller";
import { verifyEmail } from "./controllers/users-controller";
import { emitWarning } from "process";

const app = express();
const port = 4000; // luego agregar el process.env.PORT || 3000
const SECRET = "HJAFDHNAJKFBWIE";

// Middleware para configurar los headers para permitir CORS:
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next(); //Llama al siguiente middleware o controlador de la ruta
});

app.use(express.json());

// Middleware para agregar los encabezados necesarios en las respuestas HTTP, para permitir solicitudes entre diferentes dominios:
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

//este cuando funcione no va a ser necesario porque lo use en auth-controllers.
/*function getSHA256fromSTRING(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}*/

//sequelize.sync({ force: true }).then(() => {
//  console.log("Base de datos sincronizada");
app.listen(port, () => {
  console.log("Listening on port", port);
});
//});

app.post("/auth", async (req, res) => {
  if (req.body) {
    const user = await authUser(req.body);
    res.json(user);
  } else {
    res.status(400).json("Error de userData en auth-controller");
  }
});

//estaba antes pero ahora debe ir en authcontrollers la logica.
/*app.post("/auth", async (req, res) => {
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
});*/

app.post("/auth/token", async (req, res) => {
  if (!req.body) {
    res.status(400).json("No se ingresadon datos al body.");
  } else {
    const token = await authToken(req.body);
    res.json(token);
  }
});

//estaba antes pero ahora debe ir en authcontrollers la logica.
/*app.post("/auth/token", async (req, res) => {
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
});*/

/*app.post("/verify-email", async (req, res) => {
  if (req.body.email) {
    const email = await verifyEmail(req.body);
    res.json(email);
  } else {
    res.status(400).json("No se ingresadon datos al body.");
  }
});*/

app.post("/verify-email", async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json("No se ingresaron datos al body.");
      return;
    }

    // Llama a la función `verifyEmail` para buscar el usuario
    const user = await verifyEmail({ email });

    if (!user) {
      res.status(404).json({ message: "El email no está registrado." });
      return;
    }

    // Verificar si el email ya está registrado y verificado
    if (user.emailVerified) {
      res.status(400).json({ error: "Este email ya está verificado." });
      return;
    }
    /*if (user.emailVerified) {
      console.log("Este mail ya tiene una cuenta"); // Mensaje en consola
      res.status(400).json({ error: "Este email ya está verificado." });
      return;
    }*/

    res.json({ message: "Email verificado exitosamente", user });
  } catch (error: any) {
    console.error("Error en la verificación del email:", error.message);
    res.status(500).json({ error: "Ocurrió un error al verificar el email." });
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
