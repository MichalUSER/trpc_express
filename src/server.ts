import { initTRPC } from "@trpc/server";
import { OpenApiMeta, createOpenApiExpressMiddleware } from "trpc-openapi";
import { z } from "zod";
import express from "express";

const t = initTRPC.meta<OpenApiMeta>().create();

const publicProcedure = t.procedure;
const router = t.router;

let msgs: string[] = [];

const messageRouter = router({
  getMessages: publicProcedure
    .meta({ openapi: { method: "GET", path: "/getMessages" } })
    .input(z.object({}))
    .output(z.string().array())
    .query(({}) => {
      return msgs;
    }),
  addMessage: publicProcedure
    .meta({ openapi: { method: "GET", path: "/addMessage" } })
    .input(z.object({ msg: z.string() }))
    .output(z.number())
    .query(({ input }) => {
      msgs.push(input.msg);
      return 200;
    }),
});

const appRouter = router({
  // predifned router
  message: messageRouter,
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
