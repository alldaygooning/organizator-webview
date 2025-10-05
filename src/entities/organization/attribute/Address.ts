export class Address {
    private readonly _id: number;
    private _street: string;
    private _zip: string;


    constructor(id: number, street: string, zip: string) {
        this._id = id;
        this._street = street;
        this._zip = zip;
    }

    public get id(): number {
        return this._id;
    }

    public get street(): string {
        return this._street;
    }
    public set street(value: string) {
        this._street = value;
    }

    public get zip(): string {
        return this._zip;
    }
    public set zip(value: string) {
        this._zip = value;
    }
}