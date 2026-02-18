import { defineConfig } from "orval";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export default defineConfig({
  api: {
    input: `${FASTAPI_URL}/openapi.json`,
    output: {
      baseUrl: FASTAPI_URL,
      mode: "tags-split",
      target: "./lib/api",
      schemas: {
        path: "./lib/api/schemas",
        type: "zod",
      },
      client: "fetch",
      override: {
        zod: {
          coerce: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
          strict: {
            response: true,
            query: true,
            param: true,
            header: true,
            body: true,
          },
        },
      },
    },
  },
});
