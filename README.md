# Pokedex payload cms 
Live at: https://pokedex-cms.payloadcms.app/admin
## 🛠️ Development

To spin up the project locally, follow these steps:

1. First clone the repo
1. Then `cd YOUR_PROJECT_REPO `
2.  Create an env file and add MONGODB_URI and PAYLOAD_SECRET to your emnviromental variable
3. Next `yarn && yarn dev`
4. Now open `http://localhost:3000/admin` in your browser
5. Create your first admin user using the form on the page

in payload config you can whitelist which domains are whitelisted by csrf and cors as well.

That's it! Changes made in `./src` will be reflected in your app.

## 🚀 Production

To run Payload in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. First invoke the `payload build` script by running `yarn build` or `npm run build` in your project root. This creates a `./build` directory with a production-ready admin bundle.
1. Then run `yarn serve` or `npm run serve` to run Node in production and serve Payload from the `./build` directory.

### ☁️ Deployment

The project is deployed using [Payload Cloud](https://payloadcms.com/new/import).
