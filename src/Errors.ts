export class MissingFields extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'MissingFields';
    }
}
export class WrongAadObjectId extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'WrongAadObjectId';
    }   
}