import { sendResponse } from "../../utils/sendResponse";

import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { techniciansService } from "./technicians.service";

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
  const technicians = await techniciansService.getAllTechniciansFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians retrieved successfully",
    data: technicians,
  });
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const technician = await techniciansService.getTechnicianByIdFromDB(
    id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician retrieved successfully",
    data: technician,
  });
});

export const getAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const { date } = req.query;
    console.log("id", id, "Date", date);

    if (!date) {
      throw new Error("Date is required");
    }

    const result = await techniciansService.getAvailability(
      id as string,
      date as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Availability retrieved successfully",

      data: result,
    });
  },
);
export const techniciansController = {
  getAllTechnicians,
  getTechnicianById,
  getAvailability,
};
