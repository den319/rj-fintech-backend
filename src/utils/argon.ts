import argon2 from "argon2";

export const hashValue = async (password: string) => {
	return argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 65536,
		timeCost: 3,
		parallelism: 1,
	});
};

export const compareHash = async (password: string, hash: string) => {
	return argon2.verify(hash, password);
};
