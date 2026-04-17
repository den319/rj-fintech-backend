import {
	UnauthorizedException,
	NotFoundException,
	InternalServerException,
	ConflictException,
} from "../../../utils/appError";
import { RegisterSchemaType, LoginSchemaType } from "../validators/auth.validator";
import { prisma } from "../../../config/prismaClient";
import { compareHash, hashValue } from "../../../utils/argon";
import { generateAccessToken } from "../../../utils/cookie";
import { encrypt, generateUUID } from "../../../utils/utils";

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
	const hashedPassword = await hashValue(password);

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

export const loginService = async (body: LoginSchemaType, userAgent: string, ipAddress: string) => {
	const { email, password, action } = body;

	const forcedLogin = Number(action);

	let version: number = 1;

	const user = await prisma.userMaster.findUnique({
		where: { email },
		select: {
			id: true,
			password: true,
			name: true,
			email: true,
			phone: true,
		},
	});

	if (!user) {
		throw new NotFoundException("User not found!");
	}

	const userActivity = await prisma.userActivity.findUnique({
		where: {
			userId: user.id,
		},
	});

	console.log({ userActivity, forcedLogin, action });
	if (userActivity && forcedLogin === 0) {
		throw new ConflictException("User have already looged-in in another device!");
	}

	const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

	const refreshToken = generateUUID();

	const hashedToken = await hashValue(refreshToken);

	const isValid = await compareHash(password, user.password);

	if (!isValid) {
		throw new UnauthorizedException("Invalid password!");
	}

	if (forcedLogin === 1) {
		if (userActivity) {
			const oldVersion = userActivity.version.split("-");

			let newVersion = Number(oldVersion[1]);

			if (!Number.isNaN(newVersion)) {
				version = newVersion;

				await prisma.userActivity.update({
					where: {
						userId: user.id,
					},
					data: {
						version: `v-${newVersion++}`,
						token: hashedToken,
						expireAt,
						userAgent,
						ip: ipAddress,
					},
				});
			} else {
				throw new InternalServerException("The format of 'version' is invalid!");
			}
		}
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

	const userId = user.id;

	const accessToken = generateAccessToken(userId);

	if (!userActivity) {
		await prisma.userActivity.create({
			data: {
				userId,
				token: hashedToken,
				userAgent,
				ip: ipAddress,
				version: "v-1",
				expireAt,
			},
		});
	}

	const encryptedVersion = encrypt(`v-${version}`);

	// Exclude sensitive fields from response
	const { password: _password, id: _id, ...userWithoutSensitiveData } = userResponse;

	return { userData: userWithoutSensitiveData, accessToken, refreshToken:hashedToken, encryptedVersion };
};
