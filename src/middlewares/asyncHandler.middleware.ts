import { Request, Response, NextFunction } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler =
	(controller: AsyncController) => async (req: Request, res: Response, next: NextFunction) => {
		try {
			const trackId= req?.headers?.["track-id"];
			res.setHeader('track-id', trackId as string || "")
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};
