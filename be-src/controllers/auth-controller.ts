import { Auth } from "../models/auth";
import { User } from "../models/users";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

type UserData = {
  fullName: string;
  email: string;
  password: string;
};

const SECRET = "HJAFDHNAJKFBWIE"; //mas adelante let secretCrypto = process.env.SECRET_CRYPTO;

function getSHA256fromSTRING(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function authUser(userData: UserData) {
  const { fullName, email, password } = userData;
  const [user, created] = await User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      fullName,
      email,
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
