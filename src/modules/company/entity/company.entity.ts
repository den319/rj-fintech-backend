export type CompanyGroup = {
  name: string | null;
  code: string | null;
  companies: Company[];
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
};

export type Company = {
  name: string;
  gst?: string;
  legalName: string;
  address: string;
  registeredAt: Date;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
