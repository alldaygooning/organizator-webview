import { notificationService } from "../../notification/notification";
import type { OrganizationType } from "./Organization";

interface CreateOrganizationDataParams {
    coordinatesInputMode: "manual" | "existing";
    x: string;
    y: string;
    selectedCoordinateId: number | "";
    addressInputMode: "manual" | "existing";
    street: string;
    zipCode: string;
    selectedAddressId: number | "";
    postalAddressInputMode: "manual" | "existing";
    postalStreet: string;
    postalZipCode: string;
    selectedPostalAddressId: number | "";
}

interface CreateOrganizationDataResult {
    success: boolean;
    ids: {
        coordinatesId?: number;
        addressId?: number;
        postalAddressId?: number;
    };
}

export const createOrganizationData = async ({
    coordinatesInputMode,
    x,
    y,
    selectedCoordinateId,
    addressInputMode,
    street,
    zipCode,
    selectedAddressId,
    postalAddressInputMode,
    postalStreet,
    postalZipCode,
    selectedPostalAddressId,
}: CreateOrganizationDataParams): Promise<CreateOrganizationDataResult> => {
    const ids: CreateOrganizationDataResult['ids'] = {};

    try {
        if (coordinatesInputMode === "manual" && x && y) {
            const coordinatesResponse = await createCoordinates({
                x: parseInt(x),
                y: parseInt(y),
            });
            if (coordinatesResponse.status === 201) { // HTTP 201 Created
                ids.coordinatesId = coordinatesResponse.data.id;
                notificationService.success(`(${x}; ${y}) added to database`, "You can now use it")
            } else if (coordinatesResponse.status === 401) {
                throw new Error("Unauthorized to create coordinates");
            } else {
                throw new Error(`Failed to create coordinates: ${coordinatesResponse.status}`);
            }
        } else if (coordinatesInputMode === "existing" && selectedCoordinateId) {
            ids.coordinatesId = selectedCoordinateId as number;
        }

        if (addressInputMode === "manual" && street && zipCode) {
            const addressResponse = await createAddress({
                street,
                zip: zipCode,
            });
            if (addressResponse.status === 201) { // HTTP 201 Created
                ids.addressId = addressResponse.data.id;
                notificationService.success(`${street}:${zipCode} added to database`, "You can now use it")
            } else if (addressResponse.status === 401) {
                throw new Error("Unauthorized to create address");
            } else {
                throw new Error(`Failed to create address: ${addressResponse.status}`);
            }
        } else if (addressInputMode === "existing" && selectedAddressId) {
            ids.addressId = selectedAddressId as number;
        }

        if (postalAddressInputMode === "manual" && postalStreet && postalZipCode) {
            const postalAddressResponse = await createAddress({
                street: postalStreet,
                zip: postalZipCode,
            });
            if (postalAddressResponse.status === 201) { // HTTP 201 Created
                ids.postalAddressId = postalAddressResponse.data.id;
                notificationService.success(`${postalStreet}:${postalZipCode} added to database`, "You can now use it")
            } else if (postalAddressResponse.status === 401) {
                throw new Error("Unauthorized to create postal address");
            } else {
                throw new Error(`Failed to create postal address: ${postalAddressResponse.status}`);
            }
        } else if (postalAddressInputMode === "existing" && selectedPostalAddressId) {
            ids.postalAddressId = selectedPostalAddressId as number;
        }

        return { success: true, ids };
    } catch (err) {
        console.error("Error creating organization data:", err);
        return { success: false, ids: {} };
    }
};

export const createCoordinates = async (data: { x: number; y: number }) => {
    const response = await fetch('/api/organizations/coordinates/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return {
        status: response.status,
        data: responseData
    };
};

export const createAddress = async (data: { street: string; zip: string }) => {
    const response = await fetch('/api/organizations/addresses/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return {
        status: response.status,
        data: responseData
    };
};

export const createOrganization = async (data: {
    name: string;
    fullName: string;
    coordinatesId: number;
    addressId: number;
    postalAddressId: number;
    annualTurnover: number;
    employeesCount: number;
    rating: number;
    type: OrganizationType;
}) => {
    const response = await fetch('/api/organizations/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return {
        status: response.status,
        data: responseData
    };
};