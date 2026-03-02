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
      // override: {
      //   mutator: {
      //     path: './lib/api/mutator/custom-fetch.ts',
      //     name: 'customFetch'
      //   }
      // }
    },
  },
});
