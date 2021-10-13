# Cubedfilemanager-webserver

This is the webserver that is used by cubedfilemanager to handle sessions for livesync

## Installations

1. Clone this repository
2. Create a .env file in the root of the project and add the neccesary parameters
3. Run `npm install -D` to install all (dev)dependencies
4. Run `npm run build` to build the source code
5. Run `npm run start` to start the webserver

To configure cubedfilemanager to use your webserver. Go to `src/CubedFileManager.ts` and in the `init` method near the bottom, change `this.socketManager.connect('https://example.com')` to whatever url your webserver is running on. If using localhost, change to `http://localhost:<port>/`. After this, build cfm and run dist/index.js to use your own webserver.