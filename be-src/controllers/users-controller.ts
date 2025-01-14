import { User } from "../models/users";
//import { userDataAlgolia } from "../models/connection";

type UserData = {
  fullname: string;
  userId: number;
  localidad: string;
  long: number;
  lat: number;
};

export async function updateUserData(userData: UserData) {
  const { userId, localidad, fullname, long, lat } = userData;
  const newData = { fullname, localidad, lat, long };
  //const updateData = await User.update(newData, { where: { id: userId } });
  await User.update(newData, { where: { id: userId } });
  const updatedUser = await User.findOne({ where: { id: userId } });
  if (!updatedUser) {
    return "No se encuentra el usuario";
  }
  //NUEVO ALGOLIA 13/1
  /* try {
    const userAlgolia = await userDataAlgolia.partialUpdateObject({
      objectId: updatedUser.get("id"),
      fullname,
      localidad,
      _geoloc: {
        lat: lat,
        long: long,
      },
    });
  } catch (error) {
    return error;
  }*/
  //TERMINA NUEVO ALGOLIA
  if (updatedUser) {
    return updatedUser;
  } else {
    return "No se encuentra user.";
  }
}
