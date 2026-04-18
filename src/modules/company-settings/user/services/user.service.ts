import { prisma } from "../../../../config/prismaClient";
import { UserMaster, UserStatus } from "../../../../generated/prisma/client";
import { NotFoundException, UnauthorizedException } from "../../../../utils/appError";

export const getAllUsersService = async (companyCode: string) => {
	const company = await prisma.companyMaster.findUnique({
		where: { companyCode },
		select: { id: true, legalName: true },
	});

	if (!company) {
		throw new NotFoundException("Company not found");
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
                    userAccess: {
                        where: { companyId: company.id },
                        include: {
                            role: true,
                            node: true
                        }
                    }
				},
			},
			reportingManager: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	});

    const paths = await prisma.$queryRaw<{id: string, nodePath: string}[]>`
        SELECT id, "nodePath"::text FROM "OrgStructure" 
        WHERE "companyId" = ${company.id}::uuid
    `;

    const pathMap = new Map(paths.map(p => [p.id, p.nodePath]));

	const groupedUsers = mappings.reduce(
		(acc, m) => {
            // console.log(m.user.userAccess);
			const formattedUser = {
				name: m.user.name,
				email: m.user.email,
				phone: m.user.phone,
				onboardingDate: m.user.createdAt.toLocaleDateString("en-GB"),
				designation: m.designation,
				employeeId: m.employeeId,
				manager: {
					name: m.reportingManager.name,
					email: m.reportingManager.email,
				},
                accessDetails: m.user.userAccess.map(access => {
                    
                    return {
                        accessType: access.accessType,
                        roleName: access.role?.roleName,
                        roleCategory: access.role?.category,
                        roleSubCategory: access.role?.subCategory,
                        nodeName: access.node.nodeName,
                        nodePath: pathMap.get(access.nodeId) || ""
                    }
                })
			};

			// Determine which key to push to
			if (m.status === UserStatus.ACTIVE) {
				acc.activeUsers.push(formattedUser);
			} else {
				acc.inactiveUsers.push(formattedUser);
			}

			return acc;
		},
		{ activeUsers: [] as any[], inactiveUsers: [] as any[] }
	);

	return groupedUsers;
};

export const getAllRolesService= async () => {
	return prisma.role.findMany({
		select: {
			roleName: true,
			category: true,
			subCategory: true,
			permissionLevel: true,
			isActive: true,
		}
	});
}