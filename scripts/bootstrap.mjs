import util from 'util';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (bootstrap):', util.inspect(err, { depth: null, showHidden: true }));
  if (err?.stack) console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection (bootstrap):', util.inspect(reason, { depth: null, showHidden: true }));
  process.exit(1);
});

(async () => {
  try {
    // Dynamically import the app after handlers are registered
    await import('../src/app.ts');
  } catch (err) {
    console.error('Import error (bootstrap):', util.inspect(err, { depth: null, showHidden: true }));
    if (err?.stack) console.error(err.stack);
    process.exit(1);
  }
})();
