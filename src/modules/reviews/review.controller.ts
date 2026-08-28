import { Request, Response } from "express";
import httpStatus from "http-status";

import { reviewService } from "./review.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { bookingId, rating, comment } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const review = await reviewService.createReview({
    bookingId,
    userId,
    rating,
    comment,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: review,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews: any = await reviewService.getReviews();
  if (!reviews) {
    throw new Error("Reviews not retrived");
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review retrived successfully",
    data: reviews,
  });
});
export const reviewController = {
  createReview,
  getReviews,
};
