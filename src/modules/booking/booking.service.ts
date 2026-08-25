import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";

const createBooking = async (customerId: string, payload: ICreateBooking) => {
  // ------------------------------------------------
  // 1. Check service
  // ------------------------------------------------

  const checkService = await prisma.service.findUnique({
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

  if (!checkService) {
    throw new Error("Selected service does not exist");
  }

  // payload.technicianId = User.id
  if (checkService.technician?.id !== payload.technicianId) {
    throw new Error(
      "Selected service does not belong to the selected technician",
    );
  }

  // ------------------------------------------------
  // 2. Get TechnicianProfile
  // ------------------------------------------------

  const technicianProfile = checkService.technician?.technicianProfile;

  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const technicianProfileId = technicianProfile.id;

  // ------------------------------------------------
  // 3. Get selected availability
  // ------------------------------------------------

  const availability = await prisma.technicianAvailability.findUnique({
    where: {
      id: payload.availabilityId,
    },
  });

  if (!availability) {
    throw new Error("Selected availability does not exist");
  }

  // ------------------------------------------------
  // 4. Check availability belongs to technician
  // ------------------------------------------------

  if (availability.technicianId !== technicianProfileId) {
    throw new Error(
      "Selected availability does not belong to the selected technician",
    );
  }

  // ------------------------------------------------
  // 5. Check availability active
  // ------------------------------------------------

  if (!availability.isAvailable) {
    throw new Error("Selected availability is not available");
  }

  // ------------------------------------------------
  // 6. Validate selected slot
  // ------------------------------------------------

  if (!payload.slot) {
    throw new Error("Time slot is required");
  }

  if (!availability.slots.includes(payload.slot)) {
    throw new Error("Selected time slot does not belong to this availability");
  }

  // ------------------------------------------------
  // 7. Check booking date
  // ------------------------------------------------

  if (!availability.date) {
    throw new Error("Availability date not found");
  }

  const bookingDate = new Date(payload.bookingDate);

  if (Number.isNaN(bookingDate.getTime())) {
    throw new Error("Invalid booking date");
  }

  const availabilityDate = new Date(availability.date);

  const requestedDateString = bookingDate.toISOString().split("T")[0];

  const availabilityDateString = availabilityDate.toISOString().split("T")[0];

  if (requestedDateString !== availabilityDateString) {
    throw new Error("Booking date does not match the selected availability");
  }

  // ------------------------------------------------
  // 8. Check selected slot already booked
  // ------------------------------------------------

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
    throw new Error("Selected time slot is already booked");
  }

  // ------------------------------------------------
  // 9. Get amount from SERVICE, not frontend
  // ------------------------------------------------

  /*
    Replace `price` with your actual Service price field.

    Example:
    checkService.price
    checkService.basePrice
    checkService.serviceCharge
  */

  const totalAmount = checkService.price;

  // ------------------------------------------------
  // 10. Create booking
  // ------------------------------------------------

  try {
    const booking = await prisma.booking.create({
      data: {
        customerId,

        // User.id
        technicianId: payload.technicianId,

        serviceId: payload.serviceId,

        // technicianAvailability.id
        availabilityId: payload.availabilityId,

        bookingDate,

        slot: payload.slot,

        totalAmount,

        ...(payload.note && {
          note: payload.note,
        }),

        status: "REQUESTED",
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

        availability: true,
      },
    });

    return booking;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Selected time slot has already been booked");
    }

    throw error;
  }
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
