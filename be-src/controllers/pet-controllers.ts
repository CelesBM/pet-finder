import { Request, Response, NextFunction } from "express";
import { Pet, User } from "../associations/index";
import { petDataAlgolia, cloudinary } from "../models/connection";

type userPet = {
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

export async function deletePet(id: number) {
  try {
    const pet = await Pet.destroy({ where: { id } });
    const petAlgolia = await petDataAlgolia.deleteObject(id.toString());
    return pet;
  } catch (error) {
    return error;
  }
}
