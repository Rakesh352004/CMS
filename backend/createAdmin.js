const bcrypt = require('bcryptjs');
const User = require('./models/user');

const adminEmail = (process.env.ADMIN_EMAIL || 'rakesh@gmail.com').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'rakesh@123';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Demote any other admin accounts to standard users so only the configured admin remains admin.
    await User.updateMany({ role: 'admin', email: { $ne: adminEmail } }, { role: 'user' });

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'admin';
      existing.name = 'Rakesh Admin';
      existing.email = adminEmail;
      await existing.save();
      console.log(`Updated existing admin user: ${adminEmail}`);
    } else {
      await User.create({
        name: 'Rakesh Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Created admin user: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Failed to create/update admin user:', error.message);
    throw error;
  }
}

if (require.main === module) {
  createAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createAdmin;
