import { prisma } from "../../../config/prismaClient";
import { UserMaster, UserStatus } from "../../../generated/prisma/client";
import { NotFoundException, UnauthorizedException } from "../../../utils/appError";

export type OrgStructureResult = {
  nodeName: string;
  nodeType: string;
  companyId: string;
  parentId: string | null;
  nodePath: string; // The ltree gets cast to a string
};

export const getOrgStructureService= async(companyCode:string, user:UserMaster) => {

    const company = await prisma.companyMaster.findUnique({
      where: { companyCode: companyCode },
      select: { id: true, legalName: true }
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    const userMapping= await prisma.userMapping.findFirst({
        where: {
            userId: user.id,
            companyId: company.id
        }
    });

    if(!userMapping) {
        throw new UnauthorizedException("User cannot access this organization.")
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
}

export const getAllUsersService= async(companyCode:string, user:UserMaster) => {
    const company = await prisma.companyMaster.findUnique({
      where: { companyCode: companyCode },
      select: { id: true, legalName: true }
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    const userMapping= await prisma.userMapping.findFirst({
        where: {
            userId: user.id,
            companyId: company.id
        }
    });

    if(!userMapping) {
        throw new UnauthorizedException("User cannot access this organization.")
    }

    const mappings = await prisma.userMapping.findMany({
        where: { companyId: company.id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                }
            },
            reportingManager: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

const groupedUsers = mappings.reduce((acc, m) => {
        const formattedUser = {
            name: m.user.name,
            email: m.user.email,
            phone: m.user.phone,
            onboardingDate: m.user.createdAt,
            designation: m.designation,
            employeeId: m.employeeId,
            manager: { 
                name: m.reportingManager.name, 
                email: m.reportingManager.email 
            }
        };

        // Determine which key to push to
        if (m.status === UserStatus.ACTIVE) {
            acc.activeUsers.push(formattedUser);
        } else {
            acc.inactiveUsers.push(formattedUser);
        }

        return acc;
    }, { activeUsers: [] as any[], inactiveUsers: [] as any[] });

    return groupedUsers;

}