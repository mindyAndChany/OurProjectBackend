
import util from 'util';

// Improve debugging: print thrown objects/values for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  const e = err as any;
  console.error('Uncaught Exception:', util.inspect(e, { depth: null, showHidden: true }));
  if (e?.stack) console.error('stack:', e.stack);
  try { console.error('typeof:', typeof e, 'constructor:', e?.constructor?.name); } catch (_) {}
  try { console.error('ownKeys:', Object.getOwnPropertyNames(e)); } catch (_) {}
  try { console.error('ownSymbols:', Object.getOwnPropertySymbols(e)); } catch (_) {}
  try { console.error('json:', JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? String(v) : v), 2)); } catch (ex) { console.error('json stringify error:', ex); }
  try {
    if (e && typeof e === 'object') {
      for (const k of Object.getOwnPropertyNames(e)) {
        const v = e[k];
        if (v && typeof v.stack === 'string') console.error(`stack in property ${k}:`, v.stack);
      }
    }
  } catch (_) {}
  // exit after logging to avoid undefined state
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const r = reason as any;
  console.error('Unhandled Rejection:', util.inspect(r, { depth: null, showHidden: true }));
  try { console.error('typeof:', typeof r, 'constructor:', r?.constructor?.name); } catch (_) {}
  try { console.error('ownKeys:', Object.getOwnPropertyNames(r)); } catch (_) {}
  try { console.error('json:', JSON.stringify(r, (_k, v) => (typeof v === 'bigint' ? String(v) : v), 2)); } catch (ex) { console.error('json stringify error:', ex); }
  process.exit(1);
});

async function bootstrap() {
  // dynamic imports happen after we register process handlers so thrown objects during module init are captured
  const expressModule = await import('express');
  const app = expressModule.default();
  const port = process.env.PORT || 3000;

  app.use(expressModule.json());

  app.get('/', (req: any, res: any) => {
    res.send('Hello, World!');
  });

  const authRoutes = (await import('./routes/auth.routes.ts')).default;
  app.use('/api/auth', authRoutes);
  const setupSwagger = (await import('./swagger.ts')).default;
  setupSwagger(app);
  const { sequelize } = await import('./store/db.ts');
  await sequelize.sync();

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});


