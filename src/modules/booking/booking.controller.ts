import { Request, Response } from "express";

import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const result = await bookingService.createBooking(
    customerId as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
};

const getMyBookings = async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await bookingService.getMyBookings(customerId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
};

const getBookingById = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const { id } = req.params;

  const result = await bookingService.getBookingById(
    id as string,
    customerId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved successfully",
    data: result,
  });
};

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
};
