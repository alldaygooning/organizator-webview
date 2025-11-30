export enum ImportStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESSFUL = "SUCCESSFUL",
    FAILED = "FAILED"
}

export class ImportEntry {
    constructor(
        private _id: number,
        private _createdAt: string,
        private _userId: number,
        private _total: number,
        private _status: ImportStatus
    ) { }

    get id(): number { return this._id; }
    get createdAt(): string { return this._createdAt; }
    get userId(): number { return this._userId; }
    get total(): number { return this._total; }
    get status(): ImportStatus { return this._status; }

    set id(id: number) { this._id = id; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }
    set userId(userId: number) { this._userId = userId; }
    set total(total: number) { this._total = total; }
    set status(status: ImportStatus) { this._status = status; }
}