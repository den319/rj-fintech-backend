import jwt from "jsonwebtoken";
import { UnauthorizedException, NotFoundException, ForbiddenException, InternalServerException } from "../../../utils/appError";
import { RegisterSchemaType, LoginSchemaType } from "../validators/auth.validator";
import { prisma } from "../../../config/prismaClient";
import { compareHash, hashValue } from "../../../utils/bcrypt";
import { generateAccessToken } from "../../../utils/cookie";
import { Env } from "../../../config/env.config";

interface JwtPayload {
	userId: string;
}

export const registerService = async (body: RegisterSchemaType) => {
	const { email, name, password } = body;

	// 1. Check existing user
	const existingUser = await prisma.userMaster.findUnique({
		where: { email },
		select: {
			id: true,
			password: true,
			name: true,
			email: true,
			phone: true,
		},
	});

	if (existingUser) {
		throw new UnauthorizedException("User already exists!");
	}

	// 2. Hash password
	const hashedPassword = await hashValue(password, 10);

	// 3. Create user
	const newUser = await prisma.userMaster.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
		select: {
			id: true,
			password: true,
			name: true,
			email: true,
			phone: true,
		},
	});

	const userMapping = await prisma.userMapping.findFirst({
		where: { userId: newUser.id },
	});

	const company = userMapping
		? await prisma.companyMaster.findUnique({ where: { id: userMapping.companyId } })
		: null;

	const companyMapping = userMapping
		? await prisma.companyMapping.findFirst({ where: { companyId: userMapping.companyId } })
		: null;

	const groupCompany = companyMapping
		? await prisma.groupCompanyMaster.findUnique({
				where: { id: companyMapping.groupCompanyId },
			})
		: null;

	const userResponse = {
		...newUser,
		company: company?.legalName ?? null,
		brand: company?.brand ?? null,
		companyCode: company?.companyCode ?? null,
		groupName: groupCompany?.name ?? null,
		groupCode: groupCompany?.code ?? null,
	};

	return userResponse;
};

export const loginService = async (body: LoginSchemaType, userAgent:string, ipAddress:string) => {
	const { email, password } = body;

	const user = await prisma.userMaster.findUnique({
		where: { email },
		select: {
			id: true,
			password: true,
			name: true,
			email: true,
			phone: true,
			deletedAt: true,
		},
	});

	if (!user || user.deletedAt) {
		throw new NotFoundException("User not found!");
	}

	const isValid = await compareHash(password, user.password);

	if (!isValid) {
		throw new UnauthorizedException("Invalid email or password!");
	}

	const userMapping = await prisma.userMapping.findFirst({
		where: { userId: user.id },
	});

	const company = userMapping
		? await prisma.companyMaster.findUnique({ where: { id: userMapping.companyId } })
		: null;

	const companyMapping = userMapping
		? await prisma.companyMapping.findFirst({ where: { companyId: userMapping.companyId } })
		: null;

	const groupCompany = companyMapping
		? await prisma.groupCompanyMaster.findUnique({
				where: { id: companyMapping.groupCompanyId },
			})
		: null;

	const userResponse = {
		...user,
		company: company?.legalName ?? null,
		brand: company?.brand ?? null,
		companyCode: company?.companyCode ?? null,
		groupName: groupCompany?.name ?? null,
		groupCode: groupCompany?.code ?? null,
	};

	const userId = user.id as unknown as string;

	// const userActivity= await prisma.userActivity.findUnique({
	// 	where: {
	// 		userId,
	// 	}
	// })

	// if(userActivity) {
	// 	// console.log(userActivity);

	// 	// Different browser (userAgent mismatch)
	// 	if (userActivity.userAgent !== userAgent) {
	// 	throw new ForbiddenException("You are already logged in on another browser.");
	// 	}

	// 	// Same browser but different tab (tabId mismatch)
	// 	// if (userActivity.tabId !== tabId) {
	// 	// throw new ForbiddenException("You are already logged in on another tab.");
	// 	// }

	// 	// Same browser, same tab — already logged in
	// 	throw new ForbiddenException("You are already logged in.");
	// } 

	const accessToken = generateAccessToken(userId);

	const hashedToken = await hashValue(accessToken, 10);

	// const newUserActivity= await prisma.userActivity.create({
	// 	data: {
	// 		userId,
	// 		token: hashedToken,
	// 		userAgent: userAgent,
	// 		// tabId,
	// 		ip: ipAddress,
	// 	}
	// })

	// if(!newUserActivity) {
	// 	throw new InternalServerException("Something went wrong while logging-in. Please try again!")
	// }

	await prisma.userActivity.upsert({
		where: {
			userId: userId,
		},
		update: {
			token: hashedToken,
			userAgent,
			ip: ipAddress,
		},
		create: {
			userId,
			token: hashedToken,
			userAgent,
			ip: ipAddress,
		},
	});

	// Exclude sensitive fields from response
	const {
		password: _password,
		id: _id,
		deletedAt: _deletedAt,
		...userWithoutSensitiveData
	} = userResponse;

	return {userData: userWithoutSensitiveData, accessToken};
};

