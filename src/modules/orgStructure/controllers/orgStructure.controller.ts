import { Request, Response } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../../../config/http.config";
import { getOrgStructureService } from "../services/orgStructure.service";
import { error } from "console";

export const getOrgStructureController = asyncHandler(async (req: Request, res: Response) => {

    const { companyCode } = req.body;
    const user= req?.user;

    if (!companyCode) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "companyCode is required" });
    }

    if(!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: ""})
    }

    const orgStructure= await getOrgStructureService(companyCode, user);
    
	return res.status(HTTP_STATUS.OK).json({
		message: "Companies fetched successfully!",
		data: orgStructure,
	});
});
