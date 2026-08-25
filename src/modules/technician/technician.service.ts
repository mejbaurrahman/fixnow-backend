import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ITechnicianProfileUpdate } from "./technician.interface";

const updateTechnicianAvailability = async (
  technicianId: string,
  availability: {
    date: string;
    slots: string[];
    isAvailable?: boolean;
  },
) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const profileId = technician.technicianProfile.id;

  const date = new Date(availability.date);

  const existingAvailability = await prisma.technicianAvailability.findFirst({
    where: {
      technicianId: profileId,
      date,
    },
  });

  if (existingAvailability) {
    const duplicateSlots = availability.slots.filter((slot) =>
      existingAvailability.slots.includes(slot),
    );

    if (duplicateSlots.length > 0) {
      throw new Error(
        `These time slots already exist: ${duplicateSlots.join(", ")}`,
      );
    }
  }

  const newAvailability = await prisma.technicianAvailability.create({
    data: {
      technicianId: profileId,
      date,
      slots: availability.slots,
      isAvailable: availability.isAvailable ?? true,
    },
  });

  return newAvailability;
};

const updateTechnicianProfile = async (
  technicianId: string,
  profileData: ITechnicianProfileUpdate,
) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const profileId = technician.technicianProfile.id;

  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      id: profileId,
    },
    data: profileData,
  });

  return updatedProfile;
};

const getTechnicianBookings = async (technicianId: string) => {
  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
      role: "TECHNICIAN",
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician?.technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      technicianId,
    },
  });
  return bookings;
};

const updateTechnicianBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });
  return updatedBooking;
};

export const technicianService = {
  updateTechnicianAvailability,
  updateTechnicianProfile,
  getTechnicianBookings,
  updateTechnicianBookingStatus,
};
