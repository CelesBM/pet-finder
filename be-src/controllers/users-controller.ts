import { User } from "../models/users";

type UserData = {
  email: string;
};

type emailVerified = {
  email: string;
  emailVerified: boolean;
};

/*export async function verifyEmail(userData: UserData) {
  const email = userData.email;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (user) {
    return user.get("email");
  } else {
    return "No existe usuario con el mail ingresado.";
  }
}*/

//ver si a userdata le dejo solo email.

type EmailVerificationResult = {
  email: string;
  emailVerified: boolean;
};

// La función para verificar el email
async function verifyEmail(
  userData: UserData
): Promise<EmailVerificationResult | null> {
  const email = userData.email;

  // Buscar el usuario en la base de datos
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    return {
      email: user.get("email") as string, // Aseguramos el tipo de dato
      emailVerified: user.get("emailVerified") as boolean, // Obtenemos el campo booleano
    };
  }

  // Si no se encuentra el usuario, devuelve null
  return null;
}

export { verifyEmail };
