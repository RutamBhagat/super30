import app from '@/server';
import nock from 'nock';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

beforeAll(async () => {
  // Reset the data values
  await supertest(app).post('/api/reset');
});

afterEach(() => {
  nock.cleanAll(); // Clean up any mocks after each test
});

describe('e-to-E-5', () => {
  it('should handle multiple matching orders and price priorities correctly', async () => {
    // Step 1: Create users (User1 and User2)
    let response = await supertest(app)
      .post('/api/user/create/user1')
      .expect(201);
    expect(response.body.message).toBe('User user1 created');

    response = await supertest(app)
      .post('/api/user/create/user2')
      .expect(201);
    expect(response.body.message).toBe('User user2 created');

    // Step 2: Create a symbol
    response = await supertest(app)
      .post('/api/symbol/create/ETH_USD_15_Oct_2024_12_00')
      .expect(201);
    expect(response.body.message).toBe('Symbol ETH_USD_15_Oct_2024_12_00 created');

    // Step 3: Add balance to users
    await supertest(app)
      .post('/api/onramp/inr')
      .send({ userId: 'user1', amount: 500000 })
      .expect(200);
    await supertest(app)
      .post('/api/onramp/inr')
      .send({ userId: 'user2', amount: 300000 })
      .expect(200);

    // Check INR balances after adding funds
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user1).toEqual({ balance: 500000, locked: 0 });
    expect(response.body.user2).toEqual({ balance: 300000, locked: 0 });

    // Step 4: Mint tokens for User1
    response = await supertest(app)
      .post('/api/trade/mint')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 200,
        price: 1500,
      })
      .expect(200);
    expect(response.body.message).toBe(
      'Minted 200 \'yes\' and \'no\' tokens for user user1, remaining balance is 200000',
    );

    // Step 5: User1 places multiple sell orders at different prices
    await supertest(app)
      .post('/api/order/sell')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 100,
        price: 1400,
        stockType: 'yes',
      })
      .expect(200);

    await supertest(app)
      .post('/api/order/sell')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 100,
        price: 1500,
        stockType: 'yes',
      })
      .expect(200);

    // Check order book after placing multiple sell orders
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      1400: { total: 100, orders: { user1: 100 } },
      1500: { total: 100, orders: { user1: 100 } },
    });

    // Step 6: Check stock locking after placing sell orders
    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user1.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      quantity: 0,
      locked: 200,
    });

    // Step 7: User2 places a buy order for 100 tokens, should match the lower price first (1400)
    response = await supertest(app)
      .post('/api/order/buy')
      .send({
        userId: 'user2',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 100,
        price: 1500,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Buy order matched at best price 1400');

    // Check INR balances after matching the order
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user2).toEqual({ balance: 160000, locked: 0 });

    // Step 8: Verify stock balances after matching
    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user1.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      quantity: 0,
      locked: 100,
    });
    expect(response.body.user2.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      quantity: 100,
      locked: 0,
    });

    // Step 9: User2 places a buy order for 50 tokens, should partially match the 1500 sell
    response = await supertest(app)
      .post('/api/order/buy')
      .send({
        userId: 'user2',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 50,
        price: 1500,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe(
      'Buy order matched partially, 50 remaining',
    );

    // Check INR balances after partial matching
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user2).toEqual({ balance: 85000, locked: 0 });

    // Check order book after partial matching
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      1500: { total: 50, orders: { user1: 50 } },
    });

    // Step 10: User1 cancels the remaining 50 sell order
    response = await supertest(app)
      .post('/api/order/cancel')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 50,
        price: 1500,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Sell order canceled');

    // Check the order book to ensure it's empty
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({}); // No orders left

    // Step 11: Verify stock balances after matching and canceling
    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user1.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      quantity: 50,
      locked: 0,
    });
    expect(response.body.user2.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      quantity: 150,
      locked: 0,
    });
  });

  it('should create a corresponding \'no\' sell order when placing a \'yes\' buy order below market price', async () => {
    // Reset data
    await supertest(app).post('/api/reset');

    // Step 1: Create users (User1 and User2)
    await supertest(app)
      .post('/api/user/create/user1')
      .expect(201);
    await supertest(app)
      .post('/api/user/create/user2')
      .expect(201);

    // Step 2: Add balance to users (in paise)
    await supertest(app)
      .post('/api/onramp/inr')
      .send({ userId: 'user1', amount: 50000000 })
      .expect(200);
    await supertest(app)
      .post('/api/onramp/inr')
      .send({ userId: 'user2', amount: 30000000 })
      .expect(200);

    // Step 3: Create a symbol
    await supertest(app)
      .post('/api/symbol/create/ETH_USD_15_Oct_2024_12_00')
      .expect(201);

    // Step 4: Mint tokens for User1
    let response = await supertest(app)
      .post('/api/trade/mint')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 100, // Mint 100 'yes' and 100 'no' tokens
        price: 600,
      })
      .expect(200);
    expect(response.body.message).toBe(
      'Minted 100 \'yes\' and \'no\' tokens for user user1, remaining balance is 49880000',
    );

    // Step 5: Check User1's balances after minting
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user1).toEqual({
      balance: 49880000,
      locked: 0,
    });

    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user1.ETH_USD_15_Oct_2024_12_00).toEqual({
      yes: { quantity: 100, locked: 0 },
      no: { quantity: 100, locked: 0 },
    });

    // Step 6: User1 places a sell order for 'yes' shares at 600 paise (6 rs)
    response = await supertest(app)
      .post('/api/order/sell')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 100,
        price: 600,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Sell order placed and pending');

    // Step 7: Check the order book
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });

    // Step 8: User2 places a buy order for 'yes' shares at 500 paise (5 rs), below the current market price
    response = await supertest(app)
      .post('/api/order/buy')
      .send({
        userId: 'user2',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 50,
        price: 500,
        stockType: 'yes',
      })
      .expect(200);
    expect(response.body.message).toBe('Buy order placed and pending');

    // Additional INR balance checks after placing the buy order
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user2).toEqual({
      balance: 27500000,
      locked: 2500000,
    });

    // Additional stock balance checks after placing the buy order
    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user2.ETH_USD_15_Oct_2024_12_00).toEqual({
      yes: { quantity: 0, locked: 0 },
      no: { quantity: 0, locked: 0 },
    });

    // Step 9: Check the order book again to verify the corresponding 'no' sell order
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });
    expect(response.body.ETH_USD_15_Oct_2024_12_00.no).toEqual({
      500: { total: 50, orders: { user2: 50 } },
    });

    // Step 10: Check User2's balances
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user2).toEqual({
      balance: 27500000,
      locked: 2500000,
    });

    // Step 11: User1 places a buy order for 'no' shares at 500 paise, matching User2's implicit sell order
    response = await supertest(app)
      .post('/api/order/buy')
      .send({
        userId: 'user1',
        stockSymbol: 'ETH_USD_15_Oct_2024_12_00',
        quantity: 50,
        price: 500,
        stockType: 'no',
      })
      .expect(200);
    expect(response.body.message).toBe('Buy order matched at price 500 paise');

    // Step 12: Check the order book to verify the orders have been matched and removed
    response = await supertest(app)
      .get('/api/orderbook')
      .expect(200);
    expect(response.body.ETH_USD_15_Oct_2024_12_00.yes).toEqual({
      600: { total: 100, orders: { user1: 100 } },
    });
    expect(response.body.ETH_USD_15_Oct_2024_12_00.no).toEqual({});

    // Step 13: Check final balances
    response = await supertest(app)
      .get('/api/balances/inr')
      .expect(200);
    expect(response.body.user1).toEqual({
      balance: 41500000,
      locked: 0,
    });
    expect(response.body.user2).toEqual({
      balance: 30000000,
      locked: 0,
    });

    // Step 14: Check final stock balances
    response = await supertest(app)
      .get('/api/balances/stock')
      .expect(200);
    expect(response.body.user1.ETH_USD_15_Oct_2024_12_00).toEqual({
      yes: { quantity: 0, locked: 100 },
      no: { quantity: 150, locked: 0 },
    });
    expect(response.body.user2.ETH_USD_15_Oct_2024_12_00).toEqual({
      yes: { quantity: 50, locked: 0 },
      no: { quantity: 0, locked: 0 },
    });
  });
});
