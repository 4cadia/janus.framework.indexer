import HtmlData from "../../Domain/Entity/HtmlData";

export default interface IWeb3IndexerValidator {
    ValidateIndexRequestAsync(htmlData: HtmlData, callback: any);
}