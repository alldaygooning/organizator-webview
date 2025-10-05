import { DateTime } from "luxon";
import type { Coordinates } from "./attribute/Coordinates";
import type { Address } from "./attribute/Address";

export class Organization {
    private readonly _id: number;
    private _name: string;

    private _coordinates: Coordinates;
    private _creationDate: DateTime;

    private _address: Address;
    private _annualTurnover: number;
    private _employeesCount: number;
    private _rating: number;
    private _fullName: string;

    private _type: OrganizationType | null;
    private _postalAddress: Address;

    private _ownerId: number;

    constructor(
        id: number,
        name: string,
        coordinates: Coordinates,
        creationDate: DateTime,
        address: Address,
        annualTurnover: number,
        employeesCount: number,
        rating: number,
        fullName: string,
        type: OrganizationType,
        postalAddress: Address,
        ownerId: number
    ) {
        this._id = id;
        this._name = name;
        this._coordinates = coordinates;
        this._creationDate = creationDate;
        this._address = address;
        this._annualTurnover = annualTurnover;
        this._employeesCount = employeesCount;
        this._rating = rating;
        this._fullName = fullName;
        this._type = type;
        this._postalAddress = postalAddress;
        this._ownerId = ownerId;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get coordinates(): Coordinates {
        return this._coordinates;
    }

    public get creationDate(): DateTime {
        return this._creationDate;
    }

    public get address(): Address {
        return this._address;
    }

    public get annualTurnover(): number {
        return this._annualTurnover;
    }

    public get employeesCount(): number {
        return this._employeesCount;
    }

    public get rating(): number {
        return this._rating;
    }

    public get fullName(): string {
        return this._fullName;
    }

    public get type(): OrganizationType | null {
        return this._type;
    }

    public get postalAddress(): Address {
        return this._postalAddress;
    }


    public get ownerId(): number {
        return this._ownerId;
    }


    public set name(name: string) {
        this._name = name;
    }

    public set coordinates(coordinates: Coordinates) {
        this._coordinates = coordinates;
    }

    public set creationDate(creationDate: DateTime) {
        this._creationDate = creationDate;
    }

    public set address(address: Address) {
        this._address = address;
    }

    public set annualTurnover(annualTurnover: number) {
        this._annualTurnover = annualTurnover;
    }

    public set employeesCount(employeesCount: number) {
        this._employeesCount = employeesCount;
    }

    public set rating(rating: number) {
        this._rating = rating;
    }

    public set fullName(fullName: string) {
        this._fullName = fullName;
    }

    public set type(type: OrganizationType | null) {
        this._type = type;
    }

    public set postalAddress(postalAddress: Address) {
        this._postalAddress = postalAddress;
    }

    public set ownerId(v: number) {
        this._ownerId = v;
    }

}
export enum OrganizationType {
    COMMERCIAL = "COMMERCIAL",
    PUBLIC = "PUBLIC",
    GOVERNMENT = "GOVERNMENT",
    PRIVATE_LIMITED_COMPANY = "PRIVATE_LIMITED_COMPANY",
    OPEN_JOINT_STOCK_COMPANY = "OPEN_JOINT_STOCK_COMPANY"
}