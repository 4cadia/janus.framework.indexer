import { ContentType } from "./ContentType";

export default class IndexRequest {
    public Content: any;
    public ContentType: ContentType;
    public Address: string;
    public ValidZip: string;
}