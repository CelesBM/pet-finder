import { User } from "../models/users";

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
  if (updatedUser) {
    return updatedUser;
  } else {
    return "No se encuentra user.";
  }
}
