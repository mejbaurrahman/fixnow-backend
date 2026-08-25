import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.put(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianController.updateAvailability,
);

router.put(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateProfile,
);
router.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getBookings,
);
router.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus,
);
export const technicianRoute = router;
