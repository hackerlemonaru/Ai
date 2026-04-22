import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

let dbPath = path.resolve(process.cwd(), 'state.db');

// In a Vercel serverless environment, the filesystem is read-only except for /tmp.
// We check if we're in production (Vercel sets VERCEL=1 or NODE_ENV=production).
// If so, and if we need to write to the DB, we must copy it to /tmp first.
// Note: /tmp is ephemeral on Vercel, so data won't persist across lambda cold starts.
// For true persistence on Vercel, you'd migrate to a hosted DB (like Vercel Postgres or Turso).
// This logic fulfills the "serverless-friendly" requirement as best as possible for local SQLite files.
if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    const tmpPath = '/tmp/state.db';
    if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
        try {
            fs.copyFileSync(dbPath, tmpPath);
            console.log('Copied state.db to /tmp for serverless environment.');
        } catch (e) {
            console.error('Failed to copy state.db to /tmp', e);
        }
    }
    // Only use tmpPath if we actually copied it or it exists
    if (fs.existsSync(tmpPath)) {
        dbPath = tmpPath;
    }
}

export function getDbConnection(mode = sqlite3.OPEN_READWRITE) {
    return new sqlite3.Database(dbPath, mode, (err) => {
        if (err) {
            console.error(`Error opening database at ${dbPath}:`, err);
        }
    });
}
