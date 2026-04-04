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
				groupName: g.name,
				groupCode: g.code,
				companies: [],
			},
		])
	);

	const companyToGroupMap = new Map<string, string>(
		mappings.map((m) => [m.companyId, m.groupCompanyId])
	);

	const nullGroup: CompanyGroup = {
		groupName: null,
		groupCode: null,
		companies: [],
	};

	for (const company of companies) {
		const groupId = companyToGroupMap.get(company.id);

		const companyData: Company = {
			companyCode: company.companyCode,
			name: company.legalName,
			gst: company.gst ?? undefined,
			brand: company.brand ?? undefined,
			iecode: company.ieCode,
			registeredAt: company.registeredAt,
			address: company.address,
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
