import HtmlData from "../../Domain/Entity/HtmlData";
import { AbstractValidator } from 'fluent-ts-validator';
import IIpfsValidator from "../Interface/IIpfsValidator";

export default class IpfsValidator extends AbstractValidator<HtmlData> implements IIpfsValidator {
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

    public ValidateHtmlData(ipfsHtml: HtmlData) {
        return this.validate(ipfsHtml);
    }
}