import IndexedFile from './IndexedFile';
export default class IndexedResult {
    public IndexedFiles: Array<IndexedFile>;
    public Errors: string[];
    public Success: boolean = true;
}