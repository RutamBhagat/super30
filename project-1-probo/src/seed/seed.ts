import type { NewUser } from '@/schema/user';
import process from 'node:process';
import { addUser } from '@/services/user-services';
import { faker } from '@faker-js/faker';
import consola from 'consola';

const NUM_USERS = 10;

function generateUser(): NewUser {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

async function seedDatabase() {
  consola.info('Starting database seeding...');

  for (let i = 0; i < NUM_USERS; i++) {
    const userData = generateUser();
    consola.info(`Creating user: ${userData.email}`);

    try {
      await addUser(userData);
    }
    catch (error) {
      consola.error(`Error creating user: ${error}`);
    }
  }

  consola.success('Database seeding completed successfully!');
}

seedDatabase().then(() => {
  consola.info('Seeding process finished. Exiting...');
  process.exit(0);
}).catch((error) => {
  consola.error('Fatal error during database seeding:', error);
  process.exit(1);
});
