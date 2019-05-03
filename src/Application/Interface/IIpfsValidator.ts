import IndexedHtml from '../../Domain/Entity/IndexedHtml';
export default interface IIpfsValidator {
    ValidateHtmlFile(ipfsHtml: IndexedHtml);
}