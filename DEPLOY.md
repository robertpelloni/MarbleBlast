# DEPLOYMENT

## Latest Instructions
1. Run `npm install --legacy-peer-deps` (requires node-gyp).
2. Run `npm run compile` to build the TypeScript code.
3. Run `npm run bundle` to generate the `dist/` directory.
4. Deploy the contents of the `dist/` directory to any static web hosting or a Node.js server.
5. If using the Node backend, configure it in `server/data/config.json` and run `npm start`.
