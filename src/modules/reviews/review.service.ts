import { prisma } from "../../lib/prisma";
import { CreateReviewData } from "./review.interface";

const createReview = async ({
  bookingId,
  userId,
  rating,
  comment,
}: CreateReviewData) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    select: {
      customerId: true,
      technicianId: true,
      status: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new Error("You can only review your own booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review a completed booking");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("Review already exists for this booking");
  }
  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId: userId,
      technicianId: booking.technicianId,
      rating,
      comment: comment ?? null,
    },
  });

  return review;
};

const getReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      customer: true,
      technician: true,
      booking: true,
    },
  });
  return result;
};
export const reviewService = {
  createReview,
  getReviews,
};
