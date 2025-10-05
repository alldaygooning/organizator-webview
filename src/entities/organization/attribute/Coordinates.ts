import { NumberFormatException } from "../../../exception";

export class Coordinates {
    private readonly _id: number;
    private _x!: number;
    private _y!: number;

    constructor(id: number, x: number, y: number) {
        this._id = id;
        this._x = x;
        this._y = y;
    }

    public set x(x: number) {
        if (!Number.isInteger(x)) {
            throw new NumberFormatException(x);
        }
        this._x = x;
    }

    public set y(y: number) {
        if (!Number.isInteger(y)) {
            throw new NumberFormatException(y);
        }
        this._y = y;
    }

    public get id(): number {
        return this._id;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}