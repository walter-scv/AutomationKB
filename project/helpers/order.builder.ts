// helpers/order.builder.ts
import { Order } from './api';

class OrderBuilder {
  private order: Order = {
    itemId: process.env.ASSET_PRIMARY_ID ?? 'a1',   // Ternium Argentina — default asset for the common case
    amount: 1,
  };

  forAsset(itemId: string): this {
    this.order.itemId = itemId;
    return this;
  }

  withAmount(amount: number): this {
    this.order.amount = amount;
    return this;
  }

  build(): Order {
    return { ...this.order };
  }
}

export const anOrder = () => new OrderBuilder();
