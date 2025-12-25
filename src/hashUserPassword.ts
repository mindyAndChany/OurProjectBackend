import bcrypt from 'bcrypt';
import { sequelize } from './store/db.ts';
import { User } from './models/user.model.ts';

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error('Usage: tsx src/hashUserPassword.ts <email> <newPassword>');
    process.exit(1);
  }
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    const hash = await bcrypt.hash(password, 10);
    user.password_hash = hash;
    await user.save();
    console.log('Password hashed and updated for', email);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

run();
