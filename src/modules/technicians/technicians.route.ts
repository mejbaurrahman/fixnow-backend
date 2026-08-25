import { Router } from "express";
import { techniciansController } from "./technicians.controller";

const router = Router();

router.get("/", techniciansController.getAllTechnicians);
router.get("/:id", techniciansController.getTechnicianById);
router.get("/:id/availability", techniciansController.getAvailability);

export const techniciansRoute = router;
