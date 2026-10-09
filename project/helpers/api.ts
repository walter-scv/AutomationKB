// helpers/api.ts
import { APIRequestContext } from '@playwright/test';

export type Order = {
  itemId: string;
  amount: number;
};

/** Buys units of an asset directly via the API — bypasses the UI entirely. */
export async function buyAsset(request: APIRequestContext, order: Order): Promise<void> {
  await request.post('/api/buy', { data: order });
}

/** Sells units of an asset directly via the API — bypasses the UI entirely. */
export async function sellAsset(request: APIRequestContext, order: Order): Promise<void> {
  await request.post('/api/sell', { data: order });
}

/** Reads how many units of an asset the account currently holds — used to seed data before opening the app. */
export async function getUnits(request: APIRequestContext, itemId: string): Promise<number> {
  const res = await request.get('/api/user-portfolio');
  const body = await res.json();
  return body.investments.find((i: { _id: string }) => i._id === itemId)?.amountSubscribed ?? 0;
}
