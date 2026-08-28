import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();
router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/", reviewController.getReviews);
export const reviewRoute = router;
