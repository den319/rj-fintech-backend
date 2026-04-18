import { AccessType, Category, SubCategory } from "../../../../generated/prisma/enums";

export interface UserAccessDetail {
    accessType: AccessType;
    roleName: string | undefined;
    roleCategory: Category | undefined;
    roleSubCategory: SubCategory | undefined;
    nodeName: string;
    nodePath: string;
}

export interface FormattedUser {
    name: string;
    email: string;
    phone: string | null;
    onboardingDate: string;
    designation: string | null;
    employeeId: string | null;
    manager: {
        name: string | undefined;
        email: string | undefined;
    };
    accessDetails: UserAccessDetail[];
}