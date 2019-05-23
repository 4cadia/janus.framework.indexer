import HtmlData from "./HtmlData";
export default class IndexedFile {
    public IpfsHash: string;
    public FileName: string;
    public Errors: string[];
    public Success: boolean = true;
    public IsHtml: boolean = false;
    public Content: string;
    public HtmlData: HtmlData;
}