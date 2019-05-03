import IndexedHtml from "../../Domain/Entity/IndexedHtml";
import { AbstractValidator } from 'fluent-ts-validator';
import IIpfsValidator from "../Interface/IIpfsValidator";

export default class IpfsValidator extends AbstractValidator<IndexedHtml> implements IIpfsValidator {
    constructor() {
        super();
        this.validateIf(html => html.HtmlContent)
            .isNotEmpty()
            .withFailureMessage("Ipfs file not found");

        this.validateIf(html => html.Description)
            .isNotEmpty()
            .withFailureMessage("Description can't be empty");

        this.validateIf(html => html.Tags)
            .isNotNull()
            .withFailureMessage("Tags can't be empty");

        this.validateIf(html => html.Title)
            .isNotEmpty()
            .withFailureMessage("Title can't be empty");
    }

    public ValidateHtmlFile(ipfsHtml: IndexedHtml) {
        return this.validate(ipfsHtml);
    }
}