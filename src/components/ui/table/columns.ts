import type { MRT_ColumnDef } from "material-react-table";
import { DateTime } from "luxon";
import type { Address } from "../../../entities/organization/attribute/Address";
import type { Organization } from "../../../entities/organization/Organization";
import type { Coordinates } from "../../../entities/organization/attribute/Coordinates";

const formatOrganizationType = (type: string): string => {
    return type?.replace("_", " ").toLowerCase() || "-";
};

// Memoize the cell formatters to prevent infinite re-renders
const creationDateCell = ({ cell }: any) =>
    cell.getValue()
        ? DateTime.fromISO(cell.getValue() as string).toLocaleString(DateTime.DATETIME_SHORT)
        : "-";

const annualTurnoverCell = ({ cell }: any) =>
    `$${Number(cell.getValue()).toLocaleString()}`;

const typeCell = ({ cell }: any) =>
    formatOrganizationType(cell.getValue() as string);

const coordinatesCell = ({ cell }: any) => {
    const coordinates = cell.getValue() as Coordinates;
    if (!coordinates) return "-";
    return `(${coordinates.x}; ${coordinates.y})`;
};

const addressCell = ({ cell }: any) => {
    const address = cell.getValue() as Address;
    if (!address) return "-";
    return `${address.street}:${address.zip}`;
};


export const createColumns = (): MRT_ColumnDef<Organization>[] => {
    return [
        {
            accessorKey: "id",
            header: "ID",
            size: 80,
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "creationDate",
            header: "Creation Date",
            Cell: creationDateCell,
        },
        {
            accessorKey: "annualTurnover",
            header: "Annual Turnover",
            Cell: annualTurnoverCell,
        },
        {
            accessorKey: "employeesCount",
            header: "Employees Count",
        },
        {
            accessorKey: "rating",
            header: "Rating",
        },
        {
            accessorKey: "fullName",
            header: "Full Name",
        },
        {
            accessorKey: "type",
            header: "Type",
            Cell: typeCell,
        },
        {
            accessorKey: "coordinates",
            header: "Coordinates",
            Cell: coordinatesCell,
        },
        {
            accessorKey: "address",
            header: "Address",
            Cell: addressCell,
        },
        {
            accessorKey: "postalAddress",
            header: "Postal Address",
            Cell: addressCell,
        },
        {
            accessorKey: "ownerId",
            header: "Owner",
        }
    ]
};