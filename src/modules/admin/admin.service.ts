import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./admin.interface";

const getAllUsers = async () => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatus = async (id: string, status: any) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      customer: true,
      technician: true,
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createCategory = async (payload: ICreateCategory) => {
  return await prisma.category.create({
    data: payload,
  });
};
const deleteCategory = async (payload: string) => {
  return await prisma.category.delete({
    where: {
      id: payload,
    },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getAllCategories,
  createCategory,
  deleteCategory,
};
