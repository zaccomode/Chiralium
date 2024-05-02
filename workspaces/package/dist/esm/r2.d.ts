import { R2Bucket } from "@cloudflare/workers-types";
export interface IR2Serialisable<T> {
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
export declare abstract class R2Serialisable<T> implements IR2Serialisable<T> {
    id: string;
    file: any;
    constructor(id: string | null, file: any);
    put(R2: R2Bucket): Promise<boolean>;
    delete(R2: R2Bucket): Promise<boolean>;
    abstract refresh(R2: R2Bucket): Promise<T | null>;
    abstract getKey(): string;
    static getAcceptedFileTypes?(): string[];
    static getMaxmimumFileSize(): number;
    static checkValidity(request: Request): boolean;
    /** The KV prefix of this object. Must be unique compared  to other objects */
    static readonly prefix: string;
    /** A list of standard file types for images */
    static readonly standardImageFileTypes: string[];
    /** A list of standard file types for text */
    static readonly standardTextFileTypes: string[];
    /** A list of standard file types for Microsoft Office applications */
    static readonly standardMSFileTypes: string[];
    /** A list of standard file types for audio */
    static readonly standardAudioFileTypes: string[];
    /** A list of standard file types for video */
    static readonly standardVideoFileTypes: string[];
    /** A list of standard file types for compressed archives */
    static readonly standardArchiveFileTypes: string[];
    /** The default maximum file size for most normal files (in MB)*/
    static readonly defaultMaximumFileSize = 30;
}
//# sourceMappingURL=r2.d.ts.map