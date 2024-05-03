import { D1 } from "chiralium";

export class MyClass extends D1.Serialisable<MyClass> {
  url: string;
  count: number;

  constructor(
    id: string | undefined,
    version: number = MyClass.latestVersion,
    url: string,
    count: number
  ) {
    super(id, version);
    this.url = url;
    this.count = count;
  }


  // GETTERS
  static readonly tableName: string = "MyTable";
  get tableName(): string { return MyClass.tableName; }
  static readonly defaultVersion: number = 1;
  static readonly latestVersion: number = 1;


  structure(): D1.Column[] {
    return [
      { key: "url", value: this.url },
      { key: "count", value: this.count },
    ];
  }


  static parse(json: any): MyClass {
    try {
      return new MyClass(
        json.id,
        json.version,
        json.url,
        json.count
      );
    } catch (e) {
      throw new Error(`Failed to parse JSON into MyClass: ${e}`);
    }
  };


  static async find(DB: D1Database, id: string): Promise<MyClass | undefined> { 
    try { 
      const query = `SELECT * FROM ${MyClass.tableName} WHERE id = ?`;
      const result = await DB.prepare(query)
        .bind(id)
        .first();
      if (!result) return undefined;
      return MyClass.parse(result);
    } catch (e) { 
      throw new Error(`Failed to find object ${id} in MyClass: ${e}`);
    }
  }
}