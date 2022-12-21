import { initTRPC } from "@trpc/server";
import { OpenApiMeta, createOpenApiExpressMiddleware } from "trpc-openapi";
import { z } from "zod";
import express from "express";

const t = initTRPC.meta<OpenApiMeta>().create();

const publicProcedure = t.procedure;
const router = t.router;

const helloRouter = router({
  hello: publicProcedure
    .meta({ openapi: { method: "GET", path: "/hello" } })
    .input(z.object({ name: z.string() }))
    .output(z.string())
    .query(({ input }) => {
      return `hello ${input.name ?? "world"}`;
    }),
});

const appRouter = router({
  // predifned routers
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;

async function main() {
  const app = express();

  app.use("/api", createOpenApiExpressMiddleware({ router: appRouter }));
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
}

main();
