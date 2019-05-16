export default class TextHelper {
    public static GetFileExtension(fileName: string): string {
        return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    }
    public static IsFile(fileName: string): boolean {
        return this.GetFileExtension(fileName).length > 0;
    }
    public static FileIsHtml(fileName: string): boolean {
        let extension = this.GetFileExtension(fileName).toLowerCase();
        return extension == "html" || extension == "htm";
    }
}