import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import { UserService } from "../services/user.service";
import { HTTP_STATUS } from "../../../config/http.config";

const userService = new UserService();

export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    users,
  });
});

export const getUserByIdController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "User ID is required",
    });
  }

  const user = await userService.getUserById(userId as string);

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    user,
  });
});
