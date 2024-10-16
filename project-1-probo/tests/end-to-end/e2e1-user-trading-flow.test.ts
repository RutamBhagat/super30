import app from '@/server';
import nock from 'nock';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { generateUserData } from '../faker/fake-data';

beforeAll(async () => {
  // Reset the data values
  // await supertest(app).post('/api/reset');
});

afterEach(() => {
  nock.cleanAll(); // Clean up any mocks after each test
});

describe('e-to-E-1', () => {
  it('should check the response messages and status', async () => {
    // Step 1: Create a new user "user5"
    const user1Data = generateUserData();
    let response = await supertest(app)
      .post('/api/user/create')
      .send(user1Data)
      .expect(201);
    expect(response.body.message).toBe(`User ${user1Data.username} created`);

    // Step 2: Add balance to user5
    const userId = response.body.user.id;
    response = await supertest(app)
      .post('/api/onramp/inr')
      .send({
        userId,
        amount: 50000,
      })
      .expect(200);
    expect(response.body.message).toBe(`Onramped ${userId} with amount 50000`);

    // Step 3: Create a new symbol
    response = await supertest(app)
      .post('/api/symbol/create/AAPL_USD_25_Oct_2024_14_00')
      .expect(201);
    expect(response.body.message).toBe('Symbol AAPL_USD_25_Oct_2024_14_00 created');

    // Step 4: Mint tokens for User5
    response = await supertest(app)
      .post('/api/trade/mint')
      .send({
        userId,
        stockSymbol: 'AAPL_USD_25_Oct_2024_14_00',
        quantity: 25,
        price: 1000,
      })
      .expect(200);
    expect(response.body.message).toBe(
      `Minted 25 'yes' and 'no' tokens for user ${userId}, remaining balance is 0`,
    );

    // Step 5: User5 sells 10 'no' tokens
    response = await supertest(app)
      .post('/api/order/sell')
      .send({
        userId,
        stockSymbol: 'AAPL_USD_25_Oct_2024_14_00',
        quantity: 10,
        price: 1000,
        stockType: 'no',
      })
      .expect(200);
    expect(response.body.message).toBe('Sell order placed for 10 \'no\' options at price 1000.');

    // // Step 6: Create User6 and buy the 'no' tokens from the order book
    // const user2Data = generateUserData();
    // response = await supertest(app)
    //   .post('/api/user/create')
    //   .send(user2Data)
    //   .expect(201);
    // expect(response.body.message).toBe(`User ${user2Data.username} created`);

    // // Add balance to user6
    // const user2Id = response.body.user.id;
    // response = await supertest(app)
    //   .post('/api/onramp/inr')
    //   .send({
    //     userId: user2Id,
    //     amount: 20000,
    //   })
    //   .expect(200);

    // response = await supertest(app)
    //   .post('/api/order/buy')
    //   .send({
    //     userId: user2Id,
    //     stockSymbol: 'AAPL_USD_25_Oct_2024_14_00',
    //     quantity: 10,
    //     price: 1000,
    //     stockType: 'no',
    //   })
    //   .expect(200);

    // // Fetch balances after the trade
    // response = await supertest(app)
    //   .get('/api/balances/inr')
    //   .expect(200);

    // expect(response.body[user2Id]).toEqual({
    //   balance: 10000, // 20000 - (10 * 1000)
    //   locked: 0,
    // });

    // expect(response.body[userId]).toEqual({
    //   balance: 10000,
    //   locked: 0,
    // });
  });
});
