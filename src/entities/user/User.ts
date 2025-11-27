export class User {
    private _id: number;
    private _name: string;
    private _role: string;

    constructor(id: number, name: string, role: string) {
        this._id = id;
        this._name = name;
        this._role = role;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
    }

    toJSON() {
        return {
            _id: this._id,
            _name: this._name,
            _role: this._role
        };
    }
}