import type { NewOnramp } from '@/schema/onramp';
import type { NewOrder } from '@/schema/order';
import type { NewSymbol } from '@/schema/symbol';
import type { NewTrade } from '@/schema/trade';
import type { NewUser } from '@/schema/user';
import process from 'node:process';
import { onrampInr } from '@/services/onramp-services';
import { buyOrder, cancelOrder, sellOrder } from '@/services/order-services';
import { createSymbol } from '@/services/symbol-services';
import { mintTokens } from '@/services/trade-services';
import { addUser } from '@/services/user-services';
import { faker } from '@faker-js/faker';
import consola from 'consola';

const MAX_USERS = 10;
const MAX_TRADES = 20;
const MAX_SYMBOLS = 5;
const MAX_ORDERS = 15;
const MAX_ONRAMPS = 10;

function generateUser(): NewUser {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function generateTrade(userId: string, stockSymbol: string): NewTrade {
  return {
    userId,
    stockSymbol,
    quantity: faker.number.int({ min: 1, max: 100 }),
    price: faker.number.int({ min: 100, max: 1000 }),
  };
}

function generateSymbol(): NewSymbol {
  return {
    name: faker.finance.currencyName(), // Generates a random currency name
  };
}

function generateOrder(userId: string, stockSymbol: string): NewOrder {
  return {
    userId,
    stockSymbol,
    quantity: faker.number.int({ min: 1, max: 100 }),
    price: faker.number.int({ min: 100, max: 1000 }),
    stockType: faker.finance.accountName(),
  };
}

function generateOnramp(userId: string): NewOnramp {
  return {
    userId,
    amount: faker.number.int({ min: 100, max: 1000 }),
  };
}

async function seedDatabase() {
  consola.info('Starting database seeding...');

  // Seed symbols first
  const symbols: NewSymbol[] = [];
  const numSymbols = faker.number.int({ min: 1, max: MAX_SYMBOLS });

  for (let i = 0; i < numSymbols; i++) {
    const symbolData = generateSymbol();
    consola.info(`Creating symbol: ${symbolData.name}`);

    try {
      await createSymbol(symbolData);
      symbols.push(symbolData);
    }
    catch (error) {
      consola.error(`Error creating symbol: ${error}`);
    }
  }

  // Seed users
  const users = [];

  const numUsers = faker.number.int({ min: 1, max: MAX_USERS });

  for (let i = 0; i < numUsers; i++) {
    const userData = generateUser();

    consola.info(`Creating user: ${userData.email}`);

    try {
      const { user } = await addUser(userData);
      users.push(user);

      // Seed onramps for the user
      const numOnramps = faker.number.int({ min: 1, max: MAX_ONRAMPS });

      for (let j = 0; j < numOnramps; j++) {
        const onrampData = generateOnramp(user.id);
        consola.info(`Creating onramp for user: ${user.email}`);

        try {
          await onrampInr(onrampData);
        }
        catch (error) {
          consola.error(`Error creating onramp: ${error}`);
        }
      }

      // Seed trades for the user
      const numTrades = faker.number.int({ min: 1, max: MAX_TRADES });

      for (let j = 0; j < numTrades; j++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];

        if (symbol) { // Check if symbol is defined
          const tradeData = generateTrade(user.id, symbol.name);
          consola.info(`Creating trade for user: ${user.email}`);

          try {
            await mintTokens(tradeData);
          }
          catch (error) {
            consola.error(`Error creating trade: ${error}`);
          }
        }
      }

      // Seed orders for the user
      const numOrders = faker.number.int({ min: 1, max: MAX_ORDERS });

      for (let j = 0; j < numOrders; j++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];

        if (symbol) { // Check if symbol is defined
          const orderData = generateOrder(user.id, symbol.name);
          consola.info(`Creating order for user: ${user.email}`);

          try {
            await sellOrder(orderData);
          }
          catch (error) {
            consola.error(`Error creating order: ${error}`);
          }
        }
      }
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
