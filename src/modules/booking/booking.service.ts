import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";

const createBooking = async (payload: ICreateBooking) => {
  // 1. Check service

  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },

    include: {
      technician: {
        include: {
          technicianProfile: true,
        },
      },
    },
  });

  if (!service) {
    throw new Error("Selected service does not exist");
  }

  // 2. Check service belongs to technician

  if (service.technician?.id !== payload.technicianId) {
    throw new Error("Service does not belong to technician");
  }

  const technicianProfile = service.technician?.technicianProfile;

  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }

  // 3. Check availability

  const availability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId,
    },
  });

  if (!availability) {
    throw new Error("Availability not found");
  }

  if (availability.technicianId !== technicianProfile.id) {
    throw new Error("Availability does not belong to technician");
  }

  // 4. Validate slot

  if (!availability.slots.includes(payload.slot)) {
    throw new Error("Invalid slot selected");
  }

  // 5. Validate date

  const bookingDate = new Date(payload.bookingDate);

  if (Number.isNaN(bookingDate.getTime())) {
    throw new Error("Invalid booking date");
  }

  if (availability.date) {
    const availabilityDate = new Date(availability.date);

    const bookingDay = bookingDate.toISOString().split("T")[0];

    const availableDay = availabilityDate.toISOString().split("T")[0];

    if (bookingDay !== availableDay) {
      throw new Error("Booking date mismatch");
    }
  }

  // 6. Check duplicate booking

  const existingBooking = await prisma.booking.findFirst({
    where: {
      availabilityId: payload.availabilityId,

      slot: payload.slot,

      status: {
        notIn: ["CANCELLED", "DECLINED"],
      },
    },
  });

  if (existingBooking) {
    throw new Error("Slot already booked");
  }

  // 7. Create booking

  const booking = await prisma.booking.create({
    data: {
      customerId: payload.customerId,

      technicianId: payload.technicianId,

      serviceId: payload.serviceId,

      availabilityId: payload.availabilityId,

      bookingDate,

      slot: payload.slot,

      totalAmount: payload.totalAmount,

      note: payload.note || null,

      status: "REQUESTED",
    },

    include: {
      customer: true,

      technician: true,

      service: true,

      availability: true,
    },
  });

  return booking;
};

const getMyBookings = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getBookingById = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      payment: true,
      review: true,
    },
  });

  return booking;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
};
