import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import { payloadCloud } from '@payloadcms/plugin-cloud';

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
    }
  },
  csrf: [ // whitelist of domains to allow cookie auth from
    'http://localhost:3000',
    'https://pokedex-frontend-orpin.vercel.app/',
    'https://pokedex-cms.payloadcms.app'
  ],
  cors: [
    'http://localhost:3000',
    'https://pokedex-frontend-orpin.vercel.app/',
    'https://pokedex-cms.payloadcms.app/'
  ],
  collections: [
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloud()
  ]
});
