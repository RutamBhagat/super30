import app from '@/server';
import nock from 'nock';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

beforeAll(async () => {
  // Reset the data values
  await supertest(app).post('/reset');
});

afterEach(() => {
  nock.cleanAll(); // Clean up any mocks after each test
});

describe('e-to-E-2', () => {
  it('should check the response values, status, and state of the variables at regular intervals', async () => {
    // Step 1: Create a new user (User3)
    let response = await supertest(app)
      .post('/user/create/user3')
      .expect(201);
    expect(response.body.message).toBe('User user3 created');

    // Step 2: Add balance to user3
    response = await supertest(app)
      .post('/onramp/inr')
      .send({
        userId: 'user3',
        amount: 100000,
      })
      .expect(200);
    expect(response.body.message).toBe('Onramped user3 with amount 100000');

    // Fetch INR_BALANCES after adding balance
    response = await supertest(app)
      .get('/balances/inr')
      .expect(200);
    expect(response.body.user3).toEqual({
      balance: 100000,
      locked: 0,
    });

    // Step 3: Create a new symbol
    response = await supertest(app)
      .post('/symbol/create/ETH_USD_20_Oct_2024_10_00')
      .expect(201);
    expect(response.body.message).toBe('Symbol ETH_USD_20_Oct_2024_10_00 created');

    // Step 4: Mint tokens for User3
    response = await supertest(app)
      .post('/trade/mint')
      .send({
        userId: 'user3',
        stockSymbol: 'ETH_USD_20_Oct_2024_10_00',
        quantity: 50,
        price: 2000,
      })
      .expect(200);
    expect(response.body.message).toBe(
      'Minted 50 \'yes\' and \'no\' tokens for user user3, remaining balance is 0',
    );

    // Fetch STOCK_BALANCES after minting
    response = await supertest(app)
      .get('/balances/stock')
      .expect(200);
    expect(response.body.user3.ETH_USD_20_Oct_2024_10_00).toEqual({
      yes: { quantity: 50, locked: 0 },
      no: { quantity: 50, locked: 0 },
    });

    // Step 5: User3 sells 20 'yes' tokens
    response = await supertest(app)
      .post('/order/sell')
      .send({
        userId: 'user3',
        stockSymbol: 'ETH_USD_20_Oct_2024_10_00',
        quantity: 20,
        price: 2000,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Sell order placed for 20 \'yes\' options at price 2000.');

    // Fetch STOCK_BALANCES after selling
    response = await supertest(app)
      .get('/balances/stock')
      .expect(200);
    expect(response.body.user3.ETH_USD_20_Oct_2024_10_00.yes).toEqual({
      quantity: 30,
      locked: 20,
    });

    // Step 6: Create User4 and buy the 'yes' tokens from the order book
    response = await supertest(app)
      .post('/user/create/user4')
      .expect(201);
    expect(response.body.message).toBe('User user4 created');

    // Add balance to user4
    response = await supertest(app)
      .post('/onramp/inr')
      .send({
        userId: 'user4',
        amount: 60000,
      })
      .expect(200);
    expect(response.body.message).toBe('Onramped user4 with amount 60000');

    // User4 buys 20 'yes' tokens
    response = await supertest(app)
      .post('/order/buy')
      .send({
        userId: 'user4',
        stockSymbol: 'ETH_USD_20_Oct_2024_10_00',
        quantity: 20,
        price: 2000,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Buy order placed and trade executed');

    // Fetch balances after the trade
    response = await supertest(app)
      .get('/balances/inr')
      .expect(200);
    expect(response.body.user4).toEqual({
      balance: 20000,
      locked: 0,
    });
    expect(response.body.user3).toEqual({
      balance: 40000,
      locked: 0,
    });

    // Fetch STOCK_BALANCES after the trade
    response = await supertest(app)
      .get('/balances/stock')
      .expect(200);
    expect(response.body.user4.ETH_USD_20_Oct_2024_10_00.yes).toEqual({
      quantity: 20,
      locked: 0,
    });
    expect(response.body.user3.ETH_USD_20_Oct_2024_10_00.yes).toEqual({
      quantity: 30,
      locked: 0,
    });
  });
});
