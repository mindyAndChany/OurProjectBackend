import util from 'util';
import { sequelize } from '../store/db.js';

async function run() {
  try {
    console.log('Authenticating...');
    await sequelize.authenticate();
    console.log('Authenticated.');
    console.log('Syncing...');
    await sequelize.sync({ alter: false });
    console.log('Synced.');
  } catch (err) {
    const e: any = err;
    console.error('DB error:', util.inspect(e, { depth: null, showHidden: true }));
    if (e?.stack) console.error('stack:', e.stack);
    try { console.error('typeof:', typeof e, 'constructor:', e?.constructor?.name); } catch (_) {}
    try { console.error('ownKeys:', Object.getOwnPropertyNames(e)); } catch (_) {}
    try { console.error('json:', JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? String(v) : v), 2)); } catch (ex) { console.error('json stringify error:', ex); }
    process.exit(1);
  }
}

run();
