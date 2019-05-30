import { AbstractValidator } from "fluent-ts-validator";
import IndexRequest from "../../Domain/Entity/IndexRequest";
import fs from "fs";
import { ContentType } from "../../Domain/Entity/ContentType";

export default class IndexRequestValidator extends AbstractValidator<IndexRequest>  {

    constructor() {
        super();
        this.validateIf(i => i.Content)
            .isNotEmpty()
            .isNotNull()
            .withFailureMessage("Content can't be empty");

        this.validateIf(i => fs.existsSync(i.Content))
            .isEqualTo(true)
            .when(i => i.ContentType == ContentType.Folder || i.ContentType == ContentType.File)
            .withFailureMessage("Invalid Path");

        // var zip = new JSZip();
        // zip.loadAsync(null).then(zipf => {
        //     console.log("sucesso");
        // }, err => {
        //     console.log("error");
        // });
    }
}