import { D1Database } from "@cloudflare/workers-types";
/** Defines a single column */
export type Column = {
    /** The key or column header */
    key: string;
    /** The value of that column */
    value: ColumnType;
};
/** Defines a column type */
export type ColumnType = null | number | string | boolean | ArrayBuffer;
/** Defines a minimal outline for an Obstructable object.
 *
 * This is very similar to the depreciated Serialisable class, but
 * designed for the new D1 database system.
 */
export interface I_D1Serialisable<T> {
    /** A unique ID for every obstructable object */
    id: string;
    /** Retrieves the complete structure of insertable items into this table */
    completeStructure(db: D1Database): Promise<Column[]>;
    /** Inserts this object to the D1 database
     * @param DB The D1 database to operate on
     */
    insert(db: D1Database): Promise<void>;
    /** Updates this object on the D1 database. The columns to be updated
     * must exist on the `completeStructure` property, and be ready to be
     * inserted prior to calling this function.
     * @param DB The D1 database to operate on
     * @param columns The columns to update
     */
    update(db: D1Database, columns: string[]): Promise<void>;
    /** Removes this object from the D1 database
     * @param DB The D1 database to operate on
     */
    delete(db: D1Database): Promise<void>;
    /** Refreshes this object, using the latest properties found on
     * the D1 database
     * @param DB The D1 database to operate on
     */
    refresh(db: D1Database): Promise<T>;
}
/** Defines an abstract implementation of the `I_Obstructable` interface. */
export declare abstract class D1Serialisable<T> implements I_D1Serialisable<T> {
    id: string;
    constructor(id: string | null);
    static readonly tableName: string;
    abstract get tableName(): string;
    abstract completeStructure(): Promise<Column[]>;
    insert(db: D1Database): Promise<void>;
    update(db: D1Database, keys: string[]): Promise<void>;
    delete(db: D1Database): Promise<void>;
    refresh(db: D1Database): Promise<T>;
    /** Converts an Obstructed JSON object to its original class
     * @param json The JSON object to convert
     */
    static fromJson(json: any): any;
}
//# sourceMappingURL=d1.d.ts.map