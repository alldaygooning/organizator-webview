import type { Organization } from "../entities/organization/Organization";

export interface Task {
    id: string;
    name: string;
    createTime: string;
    variables: {
        existingOrgId: number;
        existingOrgName: string;
        existingOrgData: string;
        newOrgData: string;
        newOrgName: string;
    };
}

export interface ParsedTask extends Omit<Task, 'variables'> {
    existingOrg: Organization;
    newOrg: Organization;
}