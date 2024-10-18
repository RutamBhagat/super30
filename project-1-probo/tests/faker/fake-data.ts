import { faker } from '@faker-js/faker';

function generateUserData() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
}

export { generateUserData };
