/** Defines an abstract implementation of the `I_Obstructable` interface. */
export class D1Serialisable {
    constructor(id) {
        this.id = id ?? crypto.randomUUID();
    }
    // METHODS
    async insert(db) {
        try {
            // Build the query
            const structure = await this.completeStructure();
            const keys = structure.map((column) => column.key);
            const values = structure.map((column) => column.value);
            const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${keys.map((_, i) => `?${i + 1}`).join(", ")})`;
            // Execute the query
            await db.prepare(query)
                .bind(...values)
                .run();
        }
        catch (e) {
            throw new Error(`Failed to put object ${this.id} into the database: ${e}`);
        }
    }
    async update(db, keys) {
        try {
            // Get the values of the supplied columns
            const structure = await this.completeStructure();
            const columns = keys.map((column) => {
                const found = structure.find((c) => c.key === column);
                if (!found)
                    throw new Error(`Failed to find column ${column} in the complete structure`);
                return found;
            });
            // Build the query
            const query = `UPDATE ${this.tableName} SET ${columns.map((column, i) => `${column.key} = ?${i + 1}`).join(", ")} WHERE id = ?${columns.length + 1}`;
            // Execute the query
            await db.prepare(query)
                .bind(...columns.map((column) => column.value), this.id)
                .run();
        }
        catch (e) {
            throw new Error(`Failed to update object ${this.id} in the database: ${e}`);
        }
    }
    async delete(db) {
        try {
            // Build the query
            const query = `DELETE FROM ${this.tableName} WHERE id = ?1`;
            // Execute the query
            await db.prepare(query)
                .bind(this.id)
                .run();
        }
        catch (e) {
            throw new Error(`Failed to delete object ${this.id} from the database: ${e}`);
        }
    }
    async refresh(db) {
        try {
            // Build the query
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?1`;
            // Execute the query
            const result = await db.prepare(query)
                .bind(this.id)
                .first();
            // Check if the result is valid
            if (!result)
                throw new Error(`Failed to find object ${this.id} in the database`);
            // Check if the result has the required columns
            const structure = await this.completeStructure();
            const columns = structure.map((column) => column.key);
            columns.map((column) => {
                if (!result.hasOwnProperty(column))
                    throw new Error(`Failed to find column ${column} in the result`);
            });
            return D1Serialisable.fromJson(result);
        }
        catch (e) {
            throw new Error(`Failed to refresh object ${this.id} from the database: ${e}`);
        }
    }
    // STATIC METHODS
    /** Converts an Obstructed JSON object to its original class
     * @param json The JSON object to convert
     */
    static fromJson(json) {
        throw new Error("Method not implemented.");
    }
}
// GETTERS
D1Serialisable.tableName = "Obstructables";
