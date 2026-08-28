import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    throw new Error("bookingId is required");
  }

  const result = await paymentService.createPayment(userId, {
    bookingId,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Stripe signature is missing",
    });
  }

  const result = await paymentService.confirmPayment(
    req.body as Buffer,
    signature as string,
  );

  return res.status(200).json(result);
});

/**
 * GET /api/payments
 */
const getPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const result = await paymentService.getPayments(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Payment history retrieved successfully",

    data: result,
  });
});

/**
 * GET /api/payments/:id
 */
const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { id } = req.params;

  const result = await paymentService.getPaymentById(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "Payment retrieved successfully",

    data: result,
  });
});

export const paymentController = {
  createPayment,
  confirmPayment,
  getPayments,
  getPaymentById,
};
