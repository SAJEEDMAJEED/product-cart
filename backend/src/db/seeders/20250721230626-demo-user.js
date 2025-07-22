'use strict';
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('test321!', 10);
    return queryInterface.bulkInsert('Users', [
      {
        id: randomUUID(),
        email: 'superadmin@example.com',
        password: passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superAdmin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'superadmin@example.com' });

  }
};
