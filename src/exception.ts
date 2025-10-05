

export class NumberFormatException extends Error {
    private readonly n: number;

    constructor(n: number) {
        super();
        this.n = n;
    }
}

export class ApiException extends Error {
    public status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}