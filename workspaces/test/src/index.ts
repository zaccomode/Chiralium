import Env from "./utils/env";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response(env.D1 ? "D1 exists" : "No D1", { status: 200 });
	},
};
