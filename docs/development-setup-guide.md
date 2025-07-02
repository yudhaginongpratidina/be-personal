# Backend Personal Project - Development Setup Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Additional Commands](#additional-commands)

## 🔧 Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **pnpm** package manager - Install with `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/)
- **Database** (PostgreSQL/MySQL/SQLite) depending on your configuration
- **Code Editor** (VS Code recommended)

## 🚀 Project Setup

### 1. Clone Repository

First, clone the repository from GitHub and navigate to the project directory:

```bash
git clone https://github.com/yudhaginongpratidina/be-personal.git
cd be-personal
```

### 2. Copy Environment File

Create your local environment file by copying the example:

```bash
cp .env.example .env
```

This creates a `.env` file with default configurations that you can customize for your local development environment.

### 3. Install Dependencies

Install all required dependencies using pnpm:

```bash
pnpm install
```

This command will:
- Download and install all packages listed in `package.json`
- Create a `node_modules` directory
- Generate a `pnpm-lock.yaml` file for dependency locking

## ⚙️ Environment Configuration

Configure your `.env` file with the following variables. Each variable serves a specific purpose in the application:

| Variable | Description | Default Value | Required | Notes |
|----------|-------------|---------------|----------|--------|
| `HOSTNAME` | Server hostname/IP address | `localhost` | Yes | Use `0.0.0.0` for external access |
| `PORT` | Application port number | `3000` | Yes | Ensure port is not in use |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | Yes | Frontend URL for development |
| `NODE_ENV` | Runtime environment | `production` | Yes | Use `development` for dev mode |
| `LOG_LEVEL` | Logging verbosity level | `info` | No | Options: `error`, `warn`, `info`, `debug` |
| `LOG_DIR` | Directory for log files | `/var/log/myapp` | No | Ensure directory exists and is writable |
| `MAX_LOG_SIZE` | Maximum size per log file | `20m` | No | Format: number + unit (k, m, g) |
| `MAX_FILES` | Log file retention period | `14d` | No | Format: number + unit (d for days) |
| `DATABASE_URL` | Database connection string | - | Yes | Format depends on database type |
| `JWT_ACCESS_TOKEN_SECRET` | Secret for access tokens | `min-32-chars` | Yes | Must be at least 32 characters |
| `JWT_REFRESH_TOKEN_SECRET` | Secret for refresh tokens | `min-32-chars` | Yes | Must be at least 32 characters |
| `JWT_ISSUER` | JWT token issuer identifier | `your-app-name` | Yes | Usually your application name |
| `JWT_AUDIENCE` | JWT token audience | `your-app-users` | Yes | Target audience for tokens |

### 🔐 Generating Secure Secrets

For production-ready JWT secrets, generate cryptographically secure random strings:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice to generate separate secrets for access and refresh tokens.

### 📝 Database URL Examples

Configure your `DATABASE_URL` based on your database type:

**PostgreSQL:**
```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

**MySQL:**
```
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

**SQLite:**
```
DATABASE_URL="file:./dev.db"
```

## 🗃️ Database Setup

### 1. Create Database

Before running migrations, ensure your database exists:

**For PostgreSQL:**
```bash
createdb your_database_name
```

**For MySQL:**
```sql
CREATE DATABASE your_database_name;
```

### 2. Run Database Migrations

Execute the following commands to set up your database schema:

```bash
# Push schema changes to database
pnpm prisma db push

# Generate Prisma client
pnpm prisma generate
```

**What these commands do:**
- `prisma db push`: Applies schema changes to your database without creating migration files
- `prisma generate`: Generates the Prisma client based on your schema

### 3. (Optional) Seed Database

If your project includes seed data:

```bash
pnpm prisma db seed
```

## 🏃‍♂️ Running the Application

### Development Mode

Start the application in development mode with hot-reload:

```bash
pnpm run dev
```

The application will be available at:
- **URL**: `http://localhost:3000` (or your configured hostname/port)
- **Environment**: Development mode with enhanced logging and debugging

### Production Mode

For production deployment:

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::3000
# Solution: Change PORT in .env or kill process using the port
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed
- Verify database is running
- Check `DATABASE_URL` format and credentials
- Ensure database exists
- Check network connectivity

#### Prisma Client Issues
```bash
# Reset Prisma client
pnpm prisma generate --force
```

#### Environment Variables Not Loading
- Verify `.env` file exists in project root
- Check for syntax errors in `.env` file
- Restart the application after changes

#### Permission Errors (Log Directory)
```bash
# Create and set permissions for log directory
sudo mkdir -p /var/log/myapp
sudo chown $USER:$USER /var/log/myapp
```

## 📚 Additional Commands

### Database Management
```bash
# View database in Prisma Studio
pnpm prisma studio

# Reset database (⚠️ This will delete all data)
pnpm prisma db push --force-reset

# View migration status
pnpm prisma migrate status
```

### Development Tools
```bash
# Run tests
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format

# Type checking
pnpm type-check
```

### Package Management
```bash
# Add new dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Update dependencies
pnpm update

# Remove dependency
pnpm remove package-name
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT tokens
3. **Regularly update dependencies** to patch security vulnerabilities
4. **Use HTTPS** in production environments
5. **Implement rate limiting** for API endpoints
6. **Validate and sanitize** all user inputs