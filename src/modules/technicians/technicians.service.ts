import { prisma } from "../../lib/prisma";

const getAllTechniciansFromDB = async () => {
  const technicians = await prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: {
        include: {
          availability: true,
        },
      },
      reviewReceived: true,
    },
    omit: {
      password: true,
    },
  });
  return technicians;
};

const getTechnicianByIdFromDB = async (id: string) => {
  const technician = await prisma.user.findUnique({
    where: {
      id,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: {
        include: {
          availability: true,
        },
      },
      reviewReceived: true,
    },
    omit: {
      password: true,
    },
  });
  return technician;
};

export const techniciansService = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
};
