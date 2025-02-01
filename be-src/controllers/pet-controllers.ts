import { Request, Response, NextFunction } from "express";
import { Pet, User } from "../associations/index";
import { petDataAlgolia, cloudinary } from "../models/connection";

type userPet = {
  id: number; //NUEVO VER QUE NO ME CAGUE TODO
  userId: number;
  petName: string;
  petImgURL: string;
  petState: string;
  petLat: number;
  petLong: number;
  petLocation: string;
};

export async function createReport(userPet: userPet) {
  const { userId, petName, petImgURL, petState, petLat, petLong, petLocation } =
    userPet;
  const img = await cloudinary.uploader.upload(petImgURL); //datos de la imagen cargada
  const imgURL = img.secure_url; //URL de la imagen
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    const pet = await Pet.create({
      userId: user.get("id"),
      petName,
      petImgURL: imgURL,
      petState,
      petLat,
      petLong,
      petLocation,
    });
    try {
      const petAlgolia = await petDataAlgolia.saveObject({
        objectID: pet.get("id"),
        petName,
        petImgURL: imgURL,
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

export async function getAllPets(req: Request, userId: number) {
  try {
    const allPets = await Pet.findAll({ where: { userId } });
    return allPets;
  } catch (error) {
    return error;
  }
}

export async function updateReport(userPet: userPet) {
  const {
    id,
    userId,
    petName,
    petImgURL,
    petState,
    petLat,
    petLong,
    petLocation,
  } = userPet;

  try {
    // Buscar la mascota correcta por su id y userId
    const pet = await Pet.findOne({ where: { id, userId } });

    if (!pet) {
      throw new Error("Mascota no encontrada.");
    }

    // Subir la imagen si la URL es válida
    const img = await cloudinary.uploader.upload(petImgURL);
    const imgURL = img.secure_url;

    // Actualizar la mascota
    await Pet.update(
      {
        petName,
        petImgURL: imgURL,
        petState,
        petLat,
        petLong,
        petLocation,
      },
      { where: { id, userId } } // Asegurar que la actualización es por ID y UserID
    );

    // Actualizar en Algolia
    await petDataAlgolia.partialUpdateObject({
      objectID: pet.get("id"),
      petName,
      petImgURL: imgURL,
      petState,
      _geoloc: {
        lat: petLat,
        lng: petLong,
      },
      petLocation,
    });

    // Retornar la mascota actualizada
    return {
      message: "Mascota actualizada correctamente",
      pet: {
        id,
        userId,
        petName,
        petImgURL: imgURL,
        petState,
        petLat,
        petLong,
        petLocation,
      },
    };
  } catch (error) {
    return { error };
  }
}

export async function deletePet(id: number) {
  try {
    const pet = await Pet.destroy({ where: { id } });
    const petAlgolia = await petDataAlgolia.deleteObject(id.toString());
    return pet;
  } catch (error) {
    return error;
  }
}
