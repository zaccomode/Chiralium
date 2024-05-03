import { D1Database } from "@cloudflare/workers-types";

export namespace D1 {
  /** Defines a single column */
  export type Column = {
    /** The key or column header */
    key: string,
    /** The value of that column */
    value: ColumnType;
  }
  /** Defines a column type */
  export type ColumnType = null | number | string | boolean | ArrayBuffer;


  /** Defines a minimal outline for an Obstructable object.
   * 
   * This is very similar to the depreciated Serialisable class, but 
   * designed for the new D1 database system.
   */
  export interface I_Serialisable<T> {
    /** A unique ID for every obstructable object */
    id: string;
    /** A major version number for this object */
    version: number;


    /** Retrieves the structure of insertable items into this table */
    structure(db: D1Database): Column[];


    /** Inserts this object to the D1 database
     * @param DB The D1 database to operate on
     */
    insert(db: D1Database): Promise<void>;

    /** Updates this object on the D1 database. The columns to be updated
     * must exist on the `structure` property, and be ready to be 
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
  export abstract class Serialisable<T> implements I_Serialisable<T> {
    id: string;
    version: number;

    constructor(
      id: string = crypto.randomUUID(), 
      version: number
    ) {
      this.id = id;
      this.version = version;
    }


    // GETTERS
    static readonly tableName: string = "Obstructables";
    abstract get tableName(): string;

    abstract structure(): Column[];

    /** Retrieves the complete structure of the table, 
     * including the ID and version, and any user-created columns.
     */
    private completeStructure(): Column[] {
      return [
        { key: "id", value: this.id },
        { key: "version", value: this.version },
        ...this.structure(),
      ];
    }


    // METHODS
    async insert(db: D1Database): Promise<void> {
      try {
        // Build the query
        const structure = this.completeStructure();
        const keys = structure.map((column) => column.key);
        const values = structure.map((column) => column.value);

        const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${keys.map((_, i) => `?${i + 1}`).join(", ")})`;

        // Execute the query
        await db.prepare(query)
          .bind(...values)
          .run();
      } catch (e) {
        throw new Error(`Failed to put object ${this.id} into D1: ${e}`);
      }
    }

    async update(db: D1Database, keys: string[]): Promise<void> {
      try {
        // Get the values of the supplied columns
        const structure = this.completeStructure();
        const columns = keys.map((column) => {
          const found = structure.find((c) => c.key === column);
          if (!found) throw new Error(`Failed to find column ${column} in the complete structure`);
          return found;
        });

        // Build the query
        const query = `UPDATE ${this.tableName} SET ${columns.map((column, i) => `${column.key} = ?${i + 1}`).join(", ")} WHERE id = ?${columns.length + 1}`;

        // Execute the query
        await db.prepare(query)
          .bind(...columns.map((column) => column.value), this.id)
          .run();
      } catch (e) {
        throw new Error(`Failed to update object ${this.id} in D1: ${e}`);
      }
    }

    async delete(db: D1Database): Promise<void> {
      try {
        // Build the query
        const query = `DELETE FROM ${this.tableName} WHERE id = ?1`;

        // Execute the query
        await db.prepare(query)
          .bind(this.id)
          .run();
      } catch (e) {
        throw new Error(`Failed to delete object ${this.id} from D1: ${e}`);
      }
    }

    async refresh(db: D1Database): Promise<T> {
      try {
        // Build the query
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?1`;

        // Execute the query
        const result = await db.prepare(query)
          .bind(this.id)
          .first();

        // Check if the result is valid
        if (!result) throw new Error(`Failed to find object ${this.id} in D1`);

        // Check if the result has the required columns
        const structure = this.completeStructure();
        const columns = structure.map((column) => column.key);
        columns.map((column) => {
          if (!result.hasOwnProperty(column)) throw new Error(`Failed to find column ${column} in the result`);
        });

        return Serialisable.parse(result);

      } catch (e) {
        throw new Error(`Failed to refresh object ${this.id} from D1: ${e}`);
      }
    }


    // STATIC METHODS
    /** Converts an Obstructed JSON object to its original class
     * @param json The JSON object to convert
     */
    static parse(json: any): any {
      throw new Error("parse is not implemented!");
    }
  }
}