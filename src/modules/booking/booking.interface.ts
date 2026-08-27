import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateBooking {
  technicianId: string;

  serviceId: string;

  totalAmount: number;

  availabilityId: string;

  bookingDate: string;

  slot: string;

  note?: string;
}
export interface IBooking {
  id: string;

  customerId: string;
  technicianId: string;
  serviceId: string;

  bookingDate: Date;

  availabilityId: string;

  slot: string;

  status: BookingStatus;

  totalAmount: number;

  note: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type ILggoedInUser = {
  email: string;
  name: string;
  id: string;
  role: "CUSTOMER" | "ADMIN" | "TECHNICIAN";
};
