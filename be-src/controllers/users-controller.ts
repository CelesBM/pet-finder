import { User } from "../models/users";
import { userDataAlgolia } from "../models/connection";

type UserData = {
  fullname: string;
  userId: number;
  localidad: string;
  userLong: number;
  userLat: number;
};

export async function updateUserData(userData: UserData) {
  const { userId, localidad, fullname, userLong, userLat } = userData;
  const newData = { fullname, localidad, userLat, userLong };
  console.log("Datos para actualizar en la base de datos:", newData);
  await User.update(newData, { where: { id: userId } });
  const updatedUser = await User.findOne({ where: { id: userId } });
  if (!updatedUser) {
    return "No se encuentra el usuario";
  }
  console.log(newData);
  //NUEVO ALGOLIA 13/1
  try {
    const userAlgolia = await userDataAlgolia.partialUpdateObject({
      objectID: updatedUser.get("id"),
      fullname,
      localidad,
      _geoloc: {
        lat: userLat,
        lng: userLong,
      },
    });
  } catch (error) {
    return error;
  }
  //TERMINA NUEVO ALGOLIA
  if (updatedUser) {
    return updatedUser;
  } else {
    return "No se encuentra user.";
  }
}
