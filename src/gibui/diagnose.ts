async function tryImport(path: string) {
  try {
    console.log(`Importing ${path} ...`);
    const mod = await import(path);
    console.log(`OK: ${path}`);
    return mod;
  } catch (err) {
    console.error(`FAILED importing ${path}:`, err);
    throw err;
  }
}

async function run() {
  const targets = [
    './store/db.js',
    './models/permission.model.ts',
    './models/role.model.ts',
    './models/user.model.ts',
    './routes/auth.routes.ts',
    './controllers/auth.controller.ts',
    './services/auth.service.ts',
  ];

  for (const t of targets) {
    try {
      await tryImport(t);
    } catch (e) {
      console.error('Abort after failure.');
      return;
    }
  }
  console.log('All imports succeeded.');
}

run().catch((e) => {
  console.error('Diagnosis failed:', e);
  process.exit(1);
});
