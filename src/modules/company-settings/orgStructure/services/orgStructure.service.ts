import { prisma } from "../../../../config/prismaClient";
import { UserMaster } from "../../../../generated/prisma/client";
import { ForbiddenException, NotFoundException, UnauthorizedException } from "../../../../utils/appError";
import { OrgStructureResult } from "../entity/orgStructure.entity";

export const getOrgStructureService = async (companyCode: string, user: UserMaster) => {
	const company = await prisma.companyMaster.findUnique({
		where: { companyCode: companyCode },
		select: { id: true, legalName: true },
	});

	if (!company) {
		throw new NotFoundException("Company not found");
	}

	const userMapping = await prisma.userMapping.findFirst({
		where: {
			userId: user.id,
			companyId: company.id,
		},
	});

	if (!userMapping) {
		throw new ForbiddenException("User cannot access this organization.");
	}

	const orgData = await prisma.$queryRaw<OrgStructureResult[]>`
      SELECT 
        "nodeName", 
        "nodeType", 
        "nodePath"::text AS "nodePath"
      FROM "OrgStructure"
      WHERE "companyId" = ${company.id}::uuid
    `;

	return orgData;
};
