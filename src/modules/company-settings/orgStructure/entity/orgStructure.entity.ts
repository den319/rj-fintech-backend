export type OrgStructureResult = {
    nodeName: string;
    nodeType: string;
    companyId: string;
    parentId: string | null;
    nodePath: string; // The ltree gets cast to a string
};