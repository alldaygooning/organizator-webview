import { DateTime } from 'luxon';
import { Address } from '../entities/organization/attribute/Address';
import { Organization, OrganizationType } from '../entities/organization/Organization';
import { Coordinates } from '../entities/organization/attribute/Coordinates';

export const parseOrganizationFromJson = (jsonData: string | any): Organization => {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const orgData = data.organization || data;

    const coordinates = new Coordinates(
        orgData.coordinates?.id || 0,
        orgData.coordinates?.x || 0,
        orgData.coordinates?.y || 0
    );

    const address = new Address(
        orgData.address?.id || 0,
        orgData.address?.street || '',
        orgData.address?.zip || ''
    );

    const postalAddress = new Address(
        orgData.postalAddress?.id || 0,
        orgData.postalAddress?.street || '',
        orgData.postalAddress?.zip || ''
    );

    const creationDate = orgData.creationDate ?
        DateTime.fromISO(orgData.creationDate) : DateTime.now();

    return new Organization(
        orgData.id || 0,
        orgData.name,
        coordinates,
        creationDate,
        address,
        orgData.annualTurnover,
        orgData.employeesCount,
        orgData.rating,
        orgData.fullName,
        orgData.type as OrganizationType,
        postalAddress,
        orgData.ownerId || 0
    );
};