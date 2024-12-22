import { Auth } from "../models/auth";
import { User } from "../models/users";
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
    where: {
      email,
    },
  });

  if (existingUser) {
    // Hacer un casting explícito para acceder a `emailVerified`
    const userWithEmailVerified = existingUser as User & {
      emailVerified: boolean;
    };

    if (userWithEmailVerified.emailVerified) {
      return "El email ya está registrado y verificado.";
    } else {
      return "El email ya está registrado, pero no verificado.";
    }
  }

  // Crear usuario nuevo
  const [user, created] = await User.findOrCreate({
    where: {
      email,
    },
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

export async function authToken(dataAuth: AuthData) {
  const { email, password } = dataAuth;
  const auth = await Auth.findOne({
    where: {
      email,
      password: getSHA256fromSTRING(password),
    },
  });
  if (!auth) {
    throw new Error(
      "Authentication failed: User not found or incorrect credentials"
    );
  }
  const user = await User.findOne({
    where: {
      id: auth.get("userId"),
    },
  });
  if (auth) {
    const token = jwt.sign({ user }, secretCrypto);
    return { token: token };
  }
}
