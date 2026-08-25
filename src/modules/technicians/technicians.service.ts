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
      services: true,
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
      services: true,
      reviewReceived: true,
    },
    omit: {
      password: true,
    },
  });
  return technician;
};

const getAvailability = async (technicianId: string, date: string) => {
  /*
   * technicianId comes from User.id
   *
   * BookingForm sends:
   * User.id
   *
   */

  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },

    include: {
      technicianProfile: true,
    },
  });

  if (!technician || !technician.technicianProfile) {
    throw new Error("Technician not found");
  }

  const profileId = technician.technicianProfile.id;

  /*
   * Convert date
   */

  const availabilityDate = new Date(date);

  availabilityDate.setUTCHours(0, 0, 0, 0);

  /*
   * Find availability
   */

  const availability = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,

      date: availabilityDate,

      isAvailable: true,
    },

    include: {
      booking: {
        select: {
          slot: true,

          status: true,
        },
      },
    },
  });

  if (!availability) {
    return {
      availabilityId: null,

      date,

      slots: [],
    };
  }

  /*
   * Existing booked slots
   */

  const bookedSlots = availability.booking
    .filter((book) => book.status !== "CANCELLED" && book.status !== "DECLINED")

    .map((booking) => booking.slot);

  /*
   * Merge availability slots
   */

  const slots = availability.slots.map((slot) => ({
    time: slot,

    isBooked: bookedSlots.includes(slot),
  }));

  return {
    availabilityId: availability.id,

    date,

    slots,
  };
};
export const techniciansService = {
  getAllTechniciansFromDB,
  getTechnicianByIdFromDB,
  getAvailability,
};
