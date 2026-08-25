import { prisma } from "../../lib/prisma";
import { ICreateService } from "./service.interface";

const createService = async (technicianId: string, payload: ICreateService) => {
  // Verify technician exists and has a technician profile
  const technician = await prisma.user.findFirst({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician) {
    throw new Error("Technician not found");
  }

  if (!technician.technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const service = await prisma.service.create({
    data: {
      technicianId,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      duration: payload.duration,
      categoryId: payload.categoryId,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          technicianProfile: true,
        },
      },
      category: true,
    },
  });

  return service;
};

// const getAllServices = async (query: any) => {
//   const { type, location, rating } = query;
//   const services = await prisma.service.findMany({
//     where: {
//       ...(type && {
//         categroy: {
//           name: {
//             contains: type,
//             mode: "insensitive",
//           },
//         },
//       }),
//       ...(location && {
//         technician: {
//           technicianProfile: {
//             location: {
//               contains: location,
//               mode: "insensitive",
//             },
//           },
//         },
//       }),
//       ...(rating && {
//         technician: {
//           technicianProfile: {
//             averageRating: {
//               gte: parseFloat(rating),
//             },
//           },
//         },
//       }),
//     },
//     include: {
//       technician: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           phone: true,
//           role: true,
//           technicianProfile: true,
//         },
//       },
//       category: true,
//     },
//   });

//   return services;
// };

const getAllServices = async (query: any) => {
  const { search, category, location, rating } = query;

  const services = await prisma.service.findMany({
    where: {
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),

      ...(category && {
        category: {
          name: {
            contains: category,
            mode: "insensitive",
          },
        },
      }),

      ...(location && {
        technician: {
          technicianProfile: {
            location: {
              contains: location,
              mode: "insensitive",
            },
          },
        },
      }),

      ...(rating && {
        technician: {
          technicianProfile: {
            rating: {
              gte: parseFloat(rating),
            },
          },
        },
      }),
    },

    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          technicianProfile: true,
        },
      },

      category: true,
    },
  });

  return services;
};
export const serviceService = {
  createService,
  getAllServices,
};
