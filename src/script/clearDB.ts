import { prisma } from "../config/prismaClient";

async function clearDB() {
	console.log("🗑️  Clearing existing data...");
	await prisma.userActivity.deleteMany();
	await prisma.userMapping.deleteMany();
	await prisma.companyMapping.deleteMany();
	await prisma.userMaster.deleteMany();
	await prisma.$executeRaw`TRUNCATE TABLE "OrgStructure" RESTART IDENTITY CASCADE;`;
	await prisma.role.deleteMany();
	await prisma.companyMaster.deleteMany();
	await prisma.userAccess.deleteMany();
	await prisma.groupCompanyMaster.deleteMany();
	console.log("✅ Data cleared");

	process.exit(0);
}

clearDB().catch((error) => {
	console.error("❌ Cleaning failed:", error);
	process.exit(1);
});
