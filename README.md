
# YooBoba E-commerce Site

This is an e-commerce website for YooBoba, a manufacturer of boba pearls and related products.

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- PostgreSQL for database
- pg for database connectivity

## Local Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL database server
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd yooboba-ecommerce
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Copy the `.env.example` file to `.env` and update the variables with your PostgreSQL database connection details:

```bash
cp .env.example .env
```

Edit the `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yooboba_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_SSL=false
```

### Step 4: Set Up the Database

1. Create a new PostgreSQL database:

```bash
createdb yooboba_db
```

2. Run the database setup script:

```bash
npx ts-node src/lib/db/setup.ts
```

This will create the necessary tables and insert sample data.

### Step 5: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see the application.

## Database Schema

The application uses the following database tables:

- `products`: Stores product information
- `customers`: Stores customer information
- `addresses`: Stores shipping and billing addresses
- `orders`: Stores order information
- `order_items`: Stores items within each order

## Environment Variables

- `DB_HOST`: PostgreSQL database host
- `DB_PORT`: PostgreSQL database port
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: PostgreSQL database user
- `DB_PASSWORD`: PostgreSQL database password
- `DB_SSL`: Whether to use SSL for database connection

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
