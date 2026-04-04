export type CompanyGroup = {
	groupName: string | null;
	groupCode: string | null;
	companies: Company[];
};

export type Company = {
	name: string;
	gst?: string;
	address: string;
	registeredAt: Date;
	brand?: string;
	companyCode: string;
	iecode: string;
};
