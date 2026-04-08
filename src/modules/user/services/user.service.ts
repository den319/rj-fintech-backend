import { prisma } from "../../../config/prismaClient";

export const findByIdUserService = async (userId: string) => {
	return prisma.userMaster.findUnique({
		where: { id: userId },
		select: {
			// id: true,
			name: true,
			email: true,
		},
	});
};
