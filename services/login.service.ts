"use server";
import { PrismaClient } from "@prisma/client";

export const login = async (username: string, password: string) => {
  const prismaClient = new PrismaClient();
  // Verifica que el username y el password no sean vacíos
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  // Busca el usuario en la base de datos
  const user = await prismaClient.usuario.findUnique({
    where: { username: username },
  });

  // Verifica si el usuario existe
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Compara la contraseña proporcionada con la almacenada en la base de datos
  const isMatch = password == user.password;

  // Si la contraseña no coincide, lanza un error
  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  return user;
};

export const changePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string
) => {
  const prismaClient = new PrismaClient();

  if (!username || !currentPassword || !newPassword) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (newPassword.length < 6) {
    throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
  }

  if (currentPassword === newPassword) {
    throw new Error("La nueva contraseña debe ser diferente a la actual");
  }

  const user = await prismaClient.usuario.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (currentPassword !== user.password) {
    throw new Error("La contraseña actual no es correcta");
  }

  await prismaClient.usuario.update({
    where: { username },
    data: { password: newPassword },
  });

  return { success: true };
};