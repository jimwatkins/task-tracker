import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.ts',
  generates: {
    './src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../types#Context',
        mappers: {
          Task: '../types#Task',
          User: '../types#User',
        },
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
};

export default config; 