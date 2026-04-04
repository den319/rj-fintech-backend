import { prisma } from "../../../config/prismaClient";
import { Company, CompanyGroup } from "../entity/company.entity";

export const getAllCompaniesService = async () => {
  const [companies, mappings, groupCompanies] = await Promise.all([
    prisma.companyMaster.findMany(),
    prisma.companyMapping.findMany(),
    prisma.groupCompanyMaster.findMany(),
  ]);

  const groupMap = new Map<string, CompanyGroup>(
    groupCompanies.map((g) => [
      g.id,
      {
        companies: [],
        ...g,
      },
    ])
  );

  const companyToGroupMap = new Map<string, string>(
    mappings.map((m) => [m.companyId, m.groupCompanyId])
  );

  const nullGroup: CompanyGroup = {
    name: null,
    code: null,
    companies: [],
    createdAt: null,
    updatedAt: null,
  };

  for (const company of companies) {
    const groupId = companyToGroupMap.get(company.id);

    const companyData: Company = {
      name: company.name,
      gst: company.gst ?? undefined,
      legalName: company.legalName,
      address: company.address,
      registeredAt: company.registeredAt,
      brand: company.brand ?? undefined,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt ?? undefined,
    };

    if (groupId && groupMap.has(groupId)) {
      groupMap.get(groupId)?.companies.push(companyData);
    } else {
      nullGroup.companies.push(companyData);
    }
  }

  const result: CompanyGroup[] = Array.from(groupMap.values());

  if (nullGroup.companies.length > 0) {
    result.push(nullGroup);
  }

  return result;
};
