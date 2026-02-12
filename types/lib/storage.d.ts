export default class Storage {
    protected static instance: Storage | null;
    protected TAG: string;
    static getInstance(): Storage;
    setData(data: any, arg1: any, arg2: any): void;
    getData: () => any;
    clear: () => any;
}
