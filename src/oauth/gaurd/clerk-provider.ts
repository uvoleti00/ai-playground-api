import { ClerkClient, createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClerkClientProvider {
  _clerkClient: ClerkClient;
  constructor() {
    this._clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  async verifyToken(token: string): Promise<string> {
    return (
      await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
    ).sub;
  }
}
