import { prisma } from "../../../config/prismaClient";

export class UserService {
	async getAllUsers() {
		const users = await prisma.userMaster.findMany({
			select: {
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return users;
	}

	async getUserById(userId: string) {
		const user = await prisma.userMaster.findUnique({
			where: { id: userId },
			select: {
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return user;
	}

	async getUserByEmail(email: string) {
		const user = await prisma.userMaster.findUnique({
			where: { email },
		});

		return user;
	}
}

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

export const getUsersService = async (userId: string) => {
	return prisma.userMaster.findMany({
		where: {
			NOT: { id: userId },
		},
		select: {
			name: true,
			email: true,
		},
	});
};
