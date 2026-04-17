/*
	NOTE:
	-- Please run 'npm run prisma:save'
	-- if it is not working then run 'npm run prisma:generate' and then run 'npm run prisma:migrate'
	-- after it run 'npm run seed'
*/

import { prisma } from "../config/prismaClient";
import {
	AccessType,
	Category,
	PermissionLevel,
	SubCategory,
	UserStatus,
} from "../generated/prisma/enums";
import { hashValue } from "../utils/argon";

async function seed() {
	console.log("🌱 Seeding database...");

	// Clear existing data (in reverse order of dependencies)
	console.log("🗑️  Clearing existing data...");
	await prisma.userActivity.deleteMany();
	await prisma.userMapping.deleteMany();
	await prisma.companyMapping.deleteMany();
	await prisma.userAccess.deleteMany();
	await prisma.userMaster.deleteMany();
	await prisma.$executeRaw`TRUNCATE TABLE "OrgStructure" CASCADE;`;
	await prisma.role.deleteMany();
	await prisma.companyMaster.deleteMany();
	await prisma.groupCompanyMaster.deleteMany();
	console.log("✅ Data cleared");

	// Create Group Company Masters
	console.log("\n📦 Creating Group Companies...");
	const groupCompanies = await prisma.groupCompanyMaster.createMany({
		data: [
			{ name: "Tech Corp Group", code: "TCG001" },
			{ name: "Finance Holdings", code: "FH002" },
			{ name: "Retail Empire", code: "RE003" },
		],
	});
	console.log(`✅ Created ${groupCompanies.count} group companies`);

	// Get all group companies for mapping
	const allGroupCompanies = await prisma.groupCompanyMaster.findMany();

	// Create Company Masters
	console.log("\n🏢 Creating Companies...");
	const companies = await prisma.companyMaster.createMany({
		data: [
			{
				legalName: "Tech Solutions Ltd",
				gst: "GST001",
				brand: "TechSol",
				address: "USA",
				registeredAt: new Date("2022-01-15"),
				companyCode: "MVPOER44",
				ieCode: "VMWO1",
			},
			{
				legalName: "Finance Pro Inc",
				gst: "GST002",
				brand: "FinPro",
				address: "Russia",
				registeredAt: new Date("2011-04-30"),
				companyCode: "VECEBI5",
				ieCode: "XMCERI5",
			},
			{
				legalName: "Retail Max",
				gst: "GST003",
				brand: "RetailMax",
				address: "Japan",
				registeredAt: new Date("2004-09-01"),
				companyCode: "NVEINNC85",
				ieCode: "KKKS3",
			},
			{
				legalName: "Digital Services",
				gst: "GST004",
				brand: "DigiServ",
				address: "Singapore",
				registeredAt: new Date("1991-03-21"),
				companyCode: "MVVRJJS342",
				ieCode: "VEON5",
			},
		],
	});
	console.log(`✅ Created ${companies.count} companies`);

	// Get all companies for mapping
	const allCompanies = await prisma.companyMaster.findMany();

	// Create Company Mappings (link companies to group companies)
	console.log("\n🔗 Creating Company Mappings...");
	const companyMappings = [];
	for (let i = 0; i < allCompanies.length; i++) {
		const groupCompany = allGroupCompanies[i % allGroupCompanies.length];
		companyMappings.push({
			companyId: allCompanies[i].id,
			groupCompanyId: groupCompany.id,
		});
	}
	await prisma.companyMapping.createMany({ data: companyMappings });
	console.log(`✅ Created ${companyMappings.length} company mappings`);

	// Create User Masters
	console.log("\n👥 Creating Users...");
	const usersData = [
		{ name: "Alice Johnson", email: "test1@gmail.com", phone: "+1234567890" },
		{ name: "Bob Smith", email: "test2@gmail.com", phone: "+1234567891" },
		{ name: "Charlie Brown", email: "test3@gmail.com", phone: "+1234567892" },
		{ name: "Diana Prince", email: "test4@gmail.com", phone: "+1234567893" },
		{ name: "Eve Wilson", email: "test5@gmail.com", phone: "+1234567894" },
		{ name: "Frank Miller", email: "test6@gmail.com", phone: "+1234567895" },
	];

	const hashedPassword = await hashValue("password");
	const users = await prisma.userMaster.createMany({
		data: usersData.map((userData) => ({
			...userData,
			password: hashedPassword,
		})),
	});
	console.log(`✅ Created ${users.count} users`);

	// Seed Roles Table
	console.log("🔑 Seeding Roles...");
	const rolesData = [
		// System Admin Roles
		{
			roleCode: "SYS_ADMIN_VIEWER",
			roleName: "System Admin Viewer",
			category: "SYSTEM_ACCESS",
			subCategory: "ADMIN",
			permissionLevel: "VIEWER",
			view: true,
			modify: false,
			approve: false,
			initiate: false,
		},
		{
			roleCode: "SYS_ADMIN_USER",
			roleName: "System Admin User",
			category: "SYSTEM_ACCESS",
			subCategory: "ADMIN",
			permissionLevel: "USER",
			view: true,
			modify: true,
			approve: false,
			initiate: true,
		},
		{
			roleCode: "SYS_ADMIN_MGR",
			roleName: "System Admin Manager",
			category: "SYSTEM_ACCESS",
			subCategory: "ADMIN",
			permissionLevel: "MANAGER",
			view: true,
			modify: false,
			approve: true,
			initiate: false,
		},

		// User Access Roles
		{
			roleCode: "USER_ACC_VIEWER",
			roleName: "User Access Viewer",
			category: "SYSTEM_ACCESS",
			subCategory: "USER_ACC",
			permissionLevel: "VIEWER",
			view: true,
			modify: false,
			approve: false,
			initiate: false,
		},
		{
			roleCode: "USER_ACC_USER",
			roleName: "User Access User",
			category: "SYSTEM_ACCESS",
			subCategory: "USER_ACC",
			permissionLevel: "USER",
			view: true,
			modify: true,
			approve: false,
			initiate: true,
		},
		{
			roleCode: "USER_ACC_MGR",
			roleName: "User Access Manager",
			category: "SYSTEM_ACCESS",
			subCategory: "USER_ACC",
			permissionLevel: "MANAGER",
			view: true,
			modify: false,
			approve: true,
			initiate: false,
		},

		// Org Structure Roles
		{
			roleCode: "ORG_STR_VIEWER",
			roleName: "Org Structure Viewer",
			category: "SYSTEM_ACCESS",
			subCategory: "ORG_STR",
			permissionLevel: "VIEWER",
			view: true,
			modify: false,
			approve: false,
			initiate: false,
		},
		{
			roleCode: "ORG_STR_USER",
			roleName: "Org Structure User",
			category: "SYSTEM_ACCESS",
			subCategory: "ORG_STR",
			permissionLevel: "USER",
			view: true,
			modify: true,
			approve: false,
			initiate: true,
		},
		{
			roleCode: "ORG_STR_MGR",
			roleName: "Org Structure Manager",
			category: "SYSTEM_ACCESS",
			subCategory: "ORG_STR",
			permissionLevel: "MANAGER",
			view: true,
			modify: false,
			approve: true,
			initiate: false,
		},

		// Workflow Roles
		{
			roleCode: "WORK_FLOW_VIEWER",
			roleName: "Workflow Viewer",
			category: "SYSTEM_ACCESS",
			subCategory: "WORK_FLOW",
			permissionLevel: "VIEWER",
			view: true,
			modify: false,
			approve: false,
			initiate: false,
		},
		{
			roleCode: "WORK_FLOW_USER",
			roleName: "Workflow User",
			category: "SYSTEM_ACCESS",
			subCategory: "WORK_FLOW",
			permissionLevel: "USER",
			view: true,
			modify: true,
			approve: false,
			initiate: true,
		},
		{
			roleCode: "WORK_FLOW_MGR",
			roleName: "Workflow Manager",
			category: "SYSTEM_ACCESS",
			subCategory: "WORK_FLOW",
			permissionLevel: "MANAGER",
			view: true,
			modify: false,
			approve: true,
			initiate: false,
		},
	];

	for (const role of rolesData) {
		await prisma.role.upsert({
			where: { roleCode: role.roleCode },
			update: {},
			create: {
				...role,
				category: role.category as Category,
				subCategory: role.subCategory as SubCategory,
				permissionLevel: role.permissionLevel as PermissionLevel,
				isActive: true,
			},
		});
	}
	console.log(`✅ Created ${rolesData.length} roles`);

	// Get all users for mapping
	const allUsers = await prisma.userMaster.findMany();

	// Create User Mappings (link users to companies)
	console.log("\n🔗 Creating User Mappings...");
	const userMappings = [];
	for (let i = 0; i < allUsers.length; i++) {
		const company = allCompanies[i % allCompanies.length];
		const managerId = i === 0 ? allUsers[2].id : allUsers[0].id;
		const roleToAssign = rolesData[i % rolesData.length].roleCode;

		userMappings.push({
			userId: allUsers[i].id,
			companyId: company.id,
			reportingManagerId: managerId,
			roleCode: roleToAssign,
			status: UserStatus.ACTIVE,
			designation: "Employee",
			employeeId: `EMP-${i}`,
		});
	}
	await prisma.userMapping.createMany({ data: userMappings });
	console.log(`✅ Created ${userMappings.length} user mappings`);

	// Create Org Structures for multiple companies
	console.log("\n🌳 Creating Organization Structures...");

	// We will apply the hierarchy to the first two companies from allCompanies
	const targetCompanies = allCompanies.slice(0, 2);

	for (const company of targetCompanies) {
		console.log(`   - Seeding hierarchy for: ${company.legalName}`);

		const companyId = company.id;

		const orgNodes = [
			// Level 0: Root
			{
				id: "019bdaab-479f-754e-9004-d96cb93f649b",
				name: "TEST Company",
				type: "ROOT",
				path: "ROOT",
				pid: null,
			},

			// Level 1: Divisions
			{
				id: "019be954-464c-7020-9d35-4876ab334b9d",
				name: "Aluminum",
				type: "DIVISION",
				path: "ALUMINUM",
				pid: "019bdaab-479f-754e-9004-d96cb93f649b",
			},
			{
				id: "019be567-4a3a-729b-a9f5-c7150cf956dc",
				name: "Steel",
				type: "DIVISION",
				path: "STEEL",
				pid: "019bdaab-479f-754e-9004-d96cb93f649b",
			},
			{
				id: "019beabc-1234-5678-90ab-cdef12345678",
				name: "Strategy",
				type: "DIVISION",
				path: "STRATEGY",
				pid: "019bdaab-479f-754e-9004-d96cb93f649b",
			},

			// Level 2: Locations
			{
				id: "019be956-81ca-7138-be99-ebff5e6eef96",
				name: "Mumbai",
				type: "LOCATION",
				path: "ALUMINUM.MUMBAI",
				pid: "019be954-464c-7020-9d35-4876ab334b9d",
			},
			// FIXED: changed abcd-efgh-ijkl to aaaa-bbbb-cccc (valid hex)
			{
				id: "019be954-aaaa-bbbb-cccc-4876ab334b9d",
				name: "Kolkata",
				type: "LOCATION",
				path: "ALUMINUM.KOLKATA",
				pid: "019be954-464c-7020-9d35-4876ab334b9d",
			},

			// Level 3: Departments
			{
				id: "019bea0e-10b7-7786-a767-185673a26553",
				name: "Finance",
				type: "DEPARTMENT",
				path: "ALUMINUM.MUMBAI.FINANCE",
				pid: "019be956-81ca-7138-be99-ebff5e6eef96",
			},
			{
				id: "019be94b-1256-7358-ab61-2eb679daaa93",
				name: "Finance",
				type: "DEPARTMENT",
				path: "STEEL.FINANCE",
				pid: "019be567-4a3a-729b-a9f5-c7150cf956dc",
			},

			// Level 4: Sub-Departments
			{
				id: "019beabc-9999-8888-7777-185673a26553",
				name: "Procurement",
				type: "DEPARTMENT",
				path: "ALUMINUM.MUMBAI.FINANCE.PROCUREMENT",
				pid: "019bea0e-10b7-7786-a767-185673a26553",
			},
		];

		for (const node of orgNodes) {
			// Adjust the path to include a unique company prefix to avoid Ltree collisions
			// across different companies (e.g., TECH_CORP.ROOT.ALUMINUM)
			const companyPrefix = company.legalName.toUpperCase().replace(/\s/g, "_");
			const uniquePath = `${companyPrefix}.${node.path}`;

			await prisma.$executeRaw`
                INSERT INTO "OrgStructure" (id, "nodeName", "nodeType", "nodePath", "companyId", "parentId", "createdAt", 
            		"updatedAt"
				)
                VALUES (
                    ${node.id}::uuid, 
                    ${node.name}, 
                    ${node.type}, 
                    ${uniquePath}::ltree, 
                    ${companyId}::uuid, 
                    ${node.pid}::uuid,
					NOW(), 
            		NOW()
                )
                ON CONFLICT (id) DO NOTHING;
            `;
		}
	}
	console.log(
		`✅ Created OrgStructure for ${targetCompanies.length} companies using explicit IDs.`
	);

	// 7. CREATE USER ACCESS
	console.log("🛡️ Seeding User Access...");
	const accessData = [
		{
			user: allUsers[0],
			isGlobalAccess: true,
			roleCode: "SYS_ADMIN_VIEWER",
			accessType: AccessType.PRIMARY,
		},
		{
			user: allUsers[0],
			isGlobalAccess: false,
			roleCode: "ORG_STR_MGR",
			accessType: AccessType.SECONDARY,
		},
	];

	for (const access of accessData) {
		const mapping = await prisma.userMapping.findFirst({
			where: { userId: access.user.id },
			select: { companyId: true },
		});

		if (!mapping) {
			throw new Error(`User ${access.user.email} has no company mapping!`);
		}

		const node = await prisma.orgStructure.findFirst({
			where: {
				companyId: mapping.companyId,
				nodeName: "Aluminum",
			},
		});

		if (!node) {
			throw new Error(`Node not found!`);
		}

		await prisma.userAccess.create({
			data: {
				userId: access.user.id,
				companyId: mapping.companyId,
				nodeId: node.id,
				isGlobalAccess: access.isGlobalAccess,
				roleCode: access.roleCode,
				accessType: access.accessType,
			},
		});
	}

	console.log(`create user access: ${accessData.length}`);

	console.log("\n🏢 Creating a Single Company...");
	await prisma.companyMaster.create({
		data: {
			legalName: "Alpha Solutions Ltd",
			gst: "GST005",
			brand: "AlphaSol",
			address: "USA",
			registeredAt: new Date("2022-01-15"),
			companyCode: "MVPOER85",
			ieCode: "VMW88",
		},
	});
	console.log(`✅ Created a single comapny`);

	console.log("\n🎉 Seeding complete!");
	console.log("📊 Summary:");
	console.log(`   - Group Companies: ${allGroupCompanies.length}`);
	console.log(`   - Companies: ${allCompanies.length}`);
	console.log(`   - Company Mappings: ${companyMappings.length}`);
	console.log(`   - Users: ${allUsers.length}`);
	console.log(`   - User Mappings: ${userMappings.length}`);
	console.log(`   - Roles: ${rolesData.length}`);
	console.log(`	- User Access: ${accessData.length}`);

	await prisma.$disconnect();
	process.exit(0);
}

seed().catch((error) => {
	console.error("❌ Seeding failed:", error);
	process.exit(1);
});
