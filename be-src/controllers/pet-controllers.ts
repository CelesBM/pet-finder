import { Pet, User } from "../associations/index";
import { petDataAlgolia } from "../models/connection";

export async function createReport(userPet) {
  //const { userId, petName, petImgURL, petState, petLat, petLong, petLocation } = userPet; CUANDO TENGA LO DE CLOUDINARY
  const { userId, petName, petState, petLat, petLong, petLocation } = userPet;
  //
  // const image = await cloudinary.uploader.upload(petImageUrl);
  // const urlImage = image.secure_url;
  //
  const user = await User.findOne({ where: { id: userId } });
  //Si encuentra al usuario:
  if (user) {
    const pet = await Pet.create({
      userId: user.get("id"),
      petName,
      // petImageUrl: urlImage,
      petState,
      petLat,
      petLong,
      petLocation,
    });
    try {
      const petAlgolia = await petDataAlgolia.saveObject({
        objectID: pet.get("id"),
        petName,
        //petImageUrl: urlImage,
        petState,
        _geoloc: {
          lat: petLat,
          lng: petLong,
        },
        userId: user.get("id"),
        petLocation,
      });
      return pet;
    } catch (error) {
      return error;
    }
  }
}
