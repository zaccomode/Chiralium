import { R2Bucket } from "@cloudflare/workers-types";

export namespace R2 {
  export interface I_Serialisable<T> {
    /** The id of every serialisable object */
    id: string;
    /** The actual file content of this object */
    file: any;

    /** Retrieves the key (prefix + id) of the object */
    getKey(): string;




    /** Adds an object to the R2 bucket. This method does not check 
     * for the file's validity!
     * @param R2 The R2 bucket to operate on
     */
    put(R2: R2Bucket): Promise<boolean>;

    /** Removes an object from the R2 bucket
     * @param R2 The R2 bucket to operate on
     */
    delete(R2: R2Bucket): Promise<boolean>;

    /** Refreshes this object, using the latest file from
     * the R2 bucket
     * @param R2 The R2 bucket to operate on
     */
    refresh(R2: R2Bucket): Promise<T | null>;
  }

  export abstract class Serialisable<T> implements I_Serialisable<T> {
    id: string;
    file: any;

    constructor(id: string | null, file: any) {
      this.id = id ?? crypto.randomUUID();
      this.file = file;
    }



    async put(R2: R2Bucket): Promise<boolean> {
      try {
        await R2.put(this.getKey(), this.file);
        this.file = null;
        return true;
      } catch (e) {
        return false;
      }
    }

    async delete(R2: R2Bucket): Promise<boolean> {
      try {
        await R2.delete(this.getKey());
        return true;
      } catch (e) {
        return false;
      }
    }

    abstract refresh(R2: R2Bucket): Promise<T | null>;



    abstract getKey(): string;

    static getAcceptedFileTypes?(): string[];
    static getMaxmimumFileSize(): number {
      return Serialisable.defaultMaximumFileSize;
    }



    static checkValidity(request: Request): boolean {
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



    /** The KV prefix of this object. Must be unique compared  to other objects */
    static readonly prefix: string = "serialisable:";

    /** A list of standard file types for images */
    static readonly standardImageFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
    ];

    /** A list of standard file types for text */
    static readonly standardTextFileTypes = [
      "text/plain",
      "text/html",
      "application/pdf",
      "application/rtf",
    ];

    /** A list of standard file types for Microsoft Office applications */
    static readonly standardMSFileTypes = [
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
    ]

    /** A list of standard file types for audio */
    static readonly standardAudioFileTypes = [
      "audio/mpeg",
      "audio/ogg",
      "audio/opus",
      "audio/wav",
      "audio/webm",
    ];

    /** A list of standard file types for video */
    static readonly standardVideoFileTypes = [
      "video/mpeg",
      "video/mp4",
      "video/webm",
    ];

    /** A list of standard file types for compressed archives */
    static readonly standardArchiveFileTypes = [
      "application/vnd.rar",
      "application/zip",
      "application/x-7z-compressed",
    ]


    /** The default maximum file size for most normal files (in MB)*/
    static readonly defaultMaximumFileSize = 30;
  }
}