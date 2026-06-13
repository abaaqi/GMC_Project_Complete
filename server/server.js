/*
 * Convenience entry point.
 * The real startup logic (port binding, DB connection, graceful shutdown)
 * lives in src/index.js — this just runs it, so `node server.js`,
 * `npm start`, and `node src/index.js` all work the same way.
 *
 * Note: use `node` (not nodemon) in production. nodemon is a dev-only tool;
 * see package.json → "dev" for local development with auto-reload.
 */
import './src/index.js'
