import HtmlData from "../../Domain/Entity/HtmlData";
import { AbstractValidator } from 'fluent-ts-validator';
import ISpiderValidator from "../Interface/ISpiderValidator";

export default class SpiderValidator extends AbstractValidator<HtmlData> implements ISpiderValidator {
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