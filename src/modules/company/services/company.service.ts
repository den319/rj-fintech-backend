import { prisma } from "../../../config/prismaClient"


export const getAllCompaniesService= async () => {
    const companies= await prisma.companyMaster.findMany();
    
    return companies;
}