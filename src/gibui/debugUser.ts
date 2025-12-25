import util from 'util';
import { sequelize } from '../store/db.ts';
import { User } from '../models/user.model.ts';

async function run() {
  try {
    await sequelize.authenticate();
    const email = process.argv[2] || 'cp750905@gmail.com';
    console.log('Looking up user for email:', email);
    const user = await User.findOne({ where: { email }, include: [] });
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }
    console.log('User:', util.inspect(user.get({ plain: true }), { depth: null }));
    console.log('password_hash:', user.password_hash);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

run();
