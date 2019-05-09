import HtmlData from '../../Domain/Entity/HtmlData';
export default interface IIpfsValidator {
    ValidateHtmlData(ipfsHtml: HtmlData);
}