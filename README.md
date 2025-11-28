# Supermarket Task Client

TypeScript client library for the Supermarket Task Server API.

## Features

- **API Client**: TypeScript API client library (`src/lib/api.ts`) with full type definitions
- **OpenAPI Specification**: Complete OpenAPI 3.1 specification (`public/openapi.json`)

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

```typescript
import { createApiClient } from 'supermarket_task_client';

// Create API client
const api = createApiClient('http://your-api-server-url');

// Authentication
async function example() {
  // Register a new account
  const account = await api.register({
    username: 'testuser',
    email: 'test@example.com',
    password: 'securepassword'
  });

  // Login
  const token = await api.login({
    username: 'testuser',
    password: 'securepassword'
  });

  // The access token is automatically set after login
  // Now you can call authenticated endpoints

  // Get current user info
  const me = await api.getMe();

  // Shop operations
  const shops = await api.getShops();
  const newShop = await api.createShop({ name: 'My Shop', description: 'A test shop' });
  const shop = await api.getShop(newShop.id);
  await api.updateShop(shop.id, { name: 'Updated Shop Name' });

  // Shop settlements
  const settlements = await api.getShopSettlements(shop.id);
  const newSettlement = await api.createShopSettlement(shop.id, { name: 'Settlement 1' });

  // Logout
  await api.logout();
}
```

## API Endpoints

### Authentication (No login required)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get access token

### Authentication (Login required)
- `POST /auth/logout` - Logout and invalidate token
- `GET /auth/me` - Get current user information

### Shops (Login required)
- `GET /shops` - List all shops
- `GET /shops/{shop_id}` - Get shop by ID
- `POST /shops` - Create a new shop
- `PUT /shops/{shop_id}` - Update a shop
- `DELETE /shops/{shop_id}` - Delete a shop

### Shop Settlements (Login required)
- `GET /shops/{shop_id}/settlements` - List all settlements for a shop
- `GET /shops/{shop_id}/settlements/{settlement_id}` - Get settlement by ID
- `POST /shops/{shop_id}/settlements` - Create a new settlement
- `PUT /shops/{shop_id}/settlements/{settlement_id}` - Update a settlement
- `DELETE /shops/{shop_id}/settlements/{settlement_id}` - Delete a settlement

## Project Structure

```
.
├── public/
│   └── openapi.json      # OpenAPI specification
├── src/
│   ├── lib/
│   │   ├── api.ts        # API client library
│   │   └── types.ts      # TypeScript type definitions
│   └── index.ts          # Library entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Related Repositories

- [supermarket_task_server](https://github.com/MasatoraSakikoyama/supermarket_task_server) - FastAPI backend server

## License

ISC