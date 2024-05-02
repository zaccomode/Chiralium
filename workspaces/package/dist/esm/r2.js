export class R2Serialisable {
    constructor(id, file) {
        this.id = id ?? crypto.randomUUID();
        this.file = file;
    }
    async put(R2) {
        try {
            await R2.put(this.getKey(), this.file);
            this.file = null;
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async delete(R2) {
        try {
            await R2.delete(this.getKey());
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static getMaxmimumFileSize() {
        return R2Serialisable.defaultMaximumFileSize;
    }
    static checkValidity(request) {
        // Check if the file type is correct
        const contentType = request.headers.get("Content-Type");
        if (!contentType || (this.getAcceptedFileTypes && !this.getAcceptedFileTypes().includes(contentType)))
            return false;
        // Check if the file size is below the maximum
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || this.getMaxmimumFileSize() * 1e+6 < parseInt(contentLength))
            return false;
        return true;
    }
}
/** The KV prefix of this object. Must be unique compared  to other objects */
R2Serialisable.prefix = "serialisable:";
/** A list of standard file types for images */
R2Serialisable.standardImageFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/tiff",
];
/** A list of standard file types for text */
R2Serialisable.standardTextFileTypes = [
    "text/plain",
    "text/html",
    "application/pdf",
    "application/rtf",
];
/** A list of standard file types for Microsoft Office applications */
R2Serialisable.standardMSFileTypes = [
    /** .doc */
    "application/msword",
    /** .docx */
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    /** .ppt */
    "application/vnd.ms-powerpoint",
    /** .pptx */
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    /** .xls */
    "application/vnd.ms-excel",
    /** .xlsx */
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
/** A list of standard file types for audio */
R2Serialisable.standardAudioFileTypes = [
    "audio/mpeg",
    "audio/ogg",
    "audio/opus",
    "audio/wav",
    "audio/webm",
];
/** A list of standard file types for video */
R2Serialisable.standardVideoFileTypes = [
    "video/mpeg",
    "video/mp4",
    "video/webm",
];
/** A list of standard file types for compressed archives */
R2Serialisable.standardArchiveFileTypes = [
    "application/vnd.rar",
    "application/zip",
    "application/x-7z-compressed",
];
/** The default maximum file size for most normal files (in MB)*/
R2Serialisable.defaultMaximumFileSize = 30;
