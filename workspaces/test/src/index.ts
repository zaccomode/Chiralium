import { MyClass } from "./models/test";
import Env from "./utils/env";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const c = new MyClass(undefined, undefined, "https://example.com", 42);
		await c.insert(env.D1);

		c.count = 43;
		c.url = "https://example.org";
		await c.update(env.D1, ["count", "url"]);

		await c.delete(env.D1);

		return new Response("Hello, world!");
	},
};
