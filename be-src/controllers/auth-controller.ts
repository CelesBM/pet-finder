import { Auth } from "../models/auth";
import { User } from "../models/users";
import { Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

type UserData = {
  fullname: string;
  email: string;
  password: string;
};

type AuthData = {
  email: string;
  password: string;
};

const secretCrypto = "HJAFDHNAJKFBWIE"; //mas adelante let secretCrypto = process.env.SECRET_CRYPTO;

function getSHA256fromSTRING(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function authUser(userData: UserData) {
  const { fullname, email, password } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    return "Este usuario ya está registrado, dirigirse a Iniciar Sesión.";
  }

  // Crear usuario nuevo
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      fullname,
      email,
      password: getSHA256fromSTRING(password),
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: {
      userId: user.get("id"),
    },
    defaults: {
      email,
      password: getSHA256fromSTRING(password),
      userId: user.get("id"),
    },
  });
  return user;
}

/*export async function authToken(dataAuth: AuthData) {
  const { email, password } = dataAuth;
  const auth = await Auth.findOne({
    where: {
      email,
      password: getSHA256fromSTRING(password),
    },
  });
  if (!auth) {
    return "Este usuario no está registrado, por lo cual no tiene token.";
  }
  const user = await User.findOne({
    where: { id: auth.get("userId") },
  });
  if (auth) {
    const token = jwt.sign({ user }, secretCrypto);
    return { token: token };
  }
}*/

export async function authToken(dataAuth: AuthData) {
  const { email, password } = dataAuth;
  const auth = await Auth.findOne({
    where: {
      email,
      password: getSHA256fromSTRING(password),
    },
  });

  if (!auth) {
    // Retornar el mensaje de error y establecer el código de estado 400
    return {
      error: "Este usuario no está registrado.",
    };
  }

  const user = await User.findOne({
    where: { id: auth.get("userId") },
  });

  if (user) {
    const token = jwt.sign({ user }, secretCrypto);
    return { token: token };
  }

  return { error: "Error al generar el token." }; // Puedes agregar más detalles si es necesario.
}

export function authMiddleware(
  req: Request & { userauth?: any },
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("bearer ")) {
    res.status(401).json({
      error: "No autorizado. Falta token o formato incorrecto.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const data = jwt.verify(token, secretCrypto) as any;
    req.userauth = data.user; // Guardar los datos decodificados del token
    next(); // Pasar el control al siguiente middleware o controlador
  } catch (error) {
    res.status(401).json({
      error: "Token inválido o expirado.",
    });
  }
}

export async function getUser(request: Request & { user?: any }) {
  if (request.user) {
    const id = request.user.id;
    const userFound = await User.findOne({
      where: {
        id,
      },
    });
    return userFound;
  } else {
    throw new Error("Error: no hay datos en request.user");
  }
}

export async function loginUser(dataAuth: AuthData) {
  const { email, password } = dataAuth;

  if (!email || !password) {
    throw new Error("Faltan datos: email o password.");
  }

  // Buscar usuario en la tabla Auth
  const auth = await Auth.findOne({ where: { email } });

  if (!auth) {
    throw new Error("Usuario no registrado.");
  }

  // Verificar la contraseña
  const hashedPassword = getSHA256fromSTRING(password);
  if (auth.get("password") !== hashedPassword) {
    throw new Error("Contraseña incorrecta.");
  }

  // Buscar datos del usuario en la tabla User
  const user = await User.findOne({ where: { id: auth.get("userId") } });
  if (!user) {
    throw new Error("No se encontró el usuario asociado.");
  }

  return {
    message: "Autenticación exitosa.",
    user: {
      id: user.get("id"),
      fullname: user.get("fullname"),
      email: user.get("email"),
    },
  };
}
