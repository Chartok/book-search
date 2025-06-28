import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./server/schemas/schema.graphql",
  generates: {
    "./server{/resolvers/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
