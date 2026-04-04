import { prisma } from "../config/prismaClient";
import { hashValue } from "../utils/bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🗑️  Clearing existing data...");
  await prisma.userActivity.deleteMany();
  await prisma.userMapping.deleteMany();
  await prisma.companyMapping.deleteMany();
  await prisma.userMaster.deleteMany();
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
      { name: "Tech Solutions Ltd", gst: "GST001", brand: "TechSol", legalName: "Nen Tech", address: "USA", registeredAt: new Date('2022-01-15') },
      { name: "Finance Pro Inc", gst: "GST002", brand: "FinPro", legalName: "Omega Group", address: "Russia", registeredAt: new Date('2011-04-30') },
      { name: "Retail Max", gst: "GST003", brand: "RetailMax", legalName: "Hashimoto Solutions", address: "Japan", registeredAt: new Date('2004-09-01') },
      { name: "Digital Services", gst: "GST004", brand: "DigiServ", legalName: "Otter Lab", address: "Singapore", registeredAt: new Date('1991-03-21') },
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

  const hashedPassword = await hashValue("password", 10);
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

  // 6. Create User Activities (tokens)
  console.log("\n🎫 Creating User Activities...");
  const activities = [];
  for (let i = 0; i < allUsers.length; i++) {
    activities.push({
      userId: allUsers[i].id,
      token: `token_${allUsers[i].email.replace("@", "_")}_${Date.now()}`,
    });
  }
  await prisma.userActivity.createMany({ data: activities });
  console.log(`✅ Created ${activities.length} user activities`);

  console.log("\n🎉 Seeding complete!");
  console.log("📊 Summary:");
  console.log(`   - Group Companies: ${allGroupCompanies.length}`);
  console.log(`   - Companies: ${allCompanies.length}`);
  console.log(`   - Company Mappings: ${companyMappings.length}`);
  console.log(`   - Users: ${allUsers.length}`);
  console.log(`   - User Mappings: ${userMappings.length}`);
  console.log(`   - User Activities: ${activities.length}`);

  await prisma.$disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});