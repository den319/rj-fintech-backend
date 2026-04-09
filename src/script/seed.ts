import { prisma } from "../config/prismaClient";
import { hashValue } from "../utils/argon";

async function seed() {
	console.log("🌱 Seeding database...");

	// Clear existing data (in reverse order of dependencies)
	console.log("🗑️  Clearing existing data...");
	await prisma.userActivity.deleteMany();
	await prisma.userMapping.deleteMany();
	await prisma.companyMapping.deleteMany();
	await prisma.userMaster.deleteMany();
	await prisma.$executeRaw`TRUNCATE TABLE "OrgStructure" CASCADE;`;
	await prisma.companyMaster.deleteMany();
	await prisma.groupCompanyMaster.deleteMany();
	console.log("✅ Data cleared");

	// 1. Create Group Company Masters
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

	// 2. Create Company Masters
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

	// 3. Create Company Mappings (link companies to group companies)
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

	// 4. Create User Masters
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

	// Get all users for mapping
	const allUsers = await prisma.userMaster.findMany();

	// 5. Create User Mappings (link users to companies)
	console.log("\n🔗 Creating User Mappings...");
	const userMappings = [];
	for (let i = 0; i < allUsers.length; i++) {
		const company = allCompanies[i % allCompanies.length];
		userMappings.push({
			userId: allUsers[i].id,
			companyId: company.id,
		});
	}
	await prisma.userMapping.createMany({ data: userMappings });
	console.log(`✅ Created ${userMappings.length} user mappings`);

	// // 6. Create User Activities (tokens)
	// console.log("\n🎫 Creating User Activities...");
	// const activities = [];
	// for (let i = 0; i < allUsers.length; i++) {
	// 	activities.push({
	// 		userId: allUsers[i].id,
	// 		token: `token_${allUsers[i].email.replace("@", "_")}_${Date.now()}`,
	// 	});
	// }
	// await prisma.userActivity.createMany({ data: activities });
	// console.log(`✅ Created ${activities.length} user activities`);

	// 7. Create Org Structures for multiple companies
    console.log("\n🌳 Creating Organization Structures...");

    // We will apply the hierarchy to the first two companies from allCompanies
    const targetCompanies = allCompanies.slice(0, 2);

    for (const company of targetCompanies) {
        console.log(`   - Seeding hierarchy for: ${company.legalName}`);
        
        const companyId = company.id;

        // Using an array of objects that match your exact sample structure
        // Order is critical: Roots first, then Divisions, then Locations, etc.
        const orgNodes = [
			// Level 0: Root
			{ id: "019bdaab-479f-754e-9004-d96cb93f649b", name: "TEST Company", type: "ROOT", path: "ROOT", pid: null },
			
			// Level 1: Divisions
			{ id: "019be954-464c-7020-9d35-4876ab334b9d", name: "Aluminum", type: "DIVISION", path: "ROOT.ALUMINUM", pid: "019bdaab-479f-754e-9004-d96cb93f649b" },
			{ id: "019be567-4a3a-729b-a9f5-c7150cf956dc", name: "Steel", type: "DIVISION", path: "ROOT.STEEL", pid: "019bdaab-479f-754e-9004-d96cb93f649b" },
			{ id: "019beabc-1234-5678-90ab-cdef12345678", name: "Strategy", type: "DIVISION", path: "ROOT.STRATEGY", pid: "019bdaab-479f-754e-9004-d96cb93f649b" },

			// Level 2: Locations
			{ id: "019be956-81ca-7138-be99-ebff5e6eef96", name: "Mumbai", type: "LOCATION", path: "ROOT.ALUMINUM.MUMBAI", pid: "019be954-464c-7020-9d35-4876ab334b9d" },
			// FIXED: changed abcd-efgh-ijkl to aaaa-bbbb-cccc (valid hex)
			{ id: "019be954-aaaa-bbbb-cccc-4876ab334b9d", name: "Kolkata", type: "LOCATION", path: "ROOT.ALUMINUM.KOLKATA", pid: "019be954-464c-7020-9d35-4876ab334b9d" },

			// Level 3: Departments
			{ id: "019bea0e-10b7-7786-a767-185673a26553", name: "Finance", type: "DEPARTMENT", path: "ROOT.ALUMINUM.MUMBAI.FINANCE", pid: "019be956-81ca-7138-be99-ebff5e6eef96" },
			{ id: "019be94b-1256-7358-ab61-2eb679daaa93", name: "Finance", type: "DEPARTMENT", path: "ROOT.STEEL.FINANCE", pid: "019be567-4a3a-729b-a9f5-c7150cf956dc" },

			// Level 4: Sub-Departments
			{ id: "019beabc-9999-8888-7777-185673a26553", name: "Procurement", type: "DEPARTMENT", path: "ROOT.ALUMINUM.MUMBAI.FINANCE.PROCUREMENT", pid: "019bea0e-10b7-7786-a767-185673a26553" }
		];

        for (const node of orgNodes) {
            // Adjust the path to include a unique company prefix to avoid Ltree collisions 
            // across different companies (e.g., TECH_CORP.ROOT.ALUMINUM)
            const companyPrefix = company.legalName.toUpperCase().replace(/\s/g, '_');
            const uniquePath = `${companyPrefix}.${node.path}`;

            await prisma.$executeRaw`
                INSERT INTO "OrgStructure" (id, "nodeName", "nodeType", "nodePath", "companyId", "parentId")
                VALUES (
                    ${node.id}::uuid, 
                    ${node.name}, 
                    ${node.type}, 
                    ${uniquePath}::ltree, 
                    ${companyId}::uuid, 
                    ${node.pid}::uuid
                )
                ON CONFLICT (id) DO NOTHING;
            `;
        }
    }
    console.log(`✅ Created OrgStructure for ${targetCompanies.length} companies using explicit IDs.`);

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

	// console.log(`   - User Activities: ${activities.length}`);

	await prisma.$disconnect();
	process.exit(0);
}

seed().catch((error) => {
	console.error("❌ Seeding failed:", error);
	process.exit(1);
});
