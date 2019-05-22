import HtmlData from "./HtmlData";
export default class IndexedFile {
    public IpfsHash: string;
    public FileName: string;
    public Success: boolean;
    public Errors: string[];
    public IsHtml: boolean;
    public Content: string;
    public HtmlData: HtmlData;
}