

export class NumberFormatException extends Error {
    private readonly _n: number;

    constructor(n: number) {
        super();
        this._n = n;
    }


    public get n(): number {
        return this._n;
    }

}

export class ApiException extends Error {
    public status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}