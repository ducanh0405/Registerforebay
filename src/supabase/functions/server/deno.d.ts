// Type declarations to keep TypeScript tooling happy when authoring Supabase Edge Functions in this repo.

declare module "npm:hono" {
  export * from "hono";
}

declare module "npm:hono/cors" {
  export * from "hono/cors";
}

declare module "npm:hono/logger" {
  export * from "hono/logger";
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
};

