import HtmlData from '../../Domain/Entity/HtmlData';
export default interface ISpiderValidator {
    ValidateHtmlData(ipfsHtml: HtmlData);
}