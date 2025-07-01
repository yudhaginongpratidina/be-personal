# BACKEND PERSONAL

## CLONE
```bash
git clone https://github.com/yudhaginongpratidina/be-personal.git
cd be-personal
```

## PROD SETUP

### Setup Environment & Generate Secret

```bash
pnpm install
cp .env.example .env
```

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

| Variable                      | Description               | Default Value         |
| ----------------------------- | ------------------------- | --------------------- |
| HOSTNAME                      | Hostname of the server    | localhost             |
| PORT                          | Port of the server        | 3000                  |
| CORS_ORIGIN                   | CORS origin               | http://localhost:3000 |
| NODE_ENV                      | Environment               | production            |
| LOG_LEVEL                     | Log level                 | info                  |
| LOG_DIR                       | Log directory             | /var/log/myapp        |
| MAX_LOG_SIZE                  | Max log size              | 20m                   |
| MAX_FILES                     | Max log files             | 14d                   |
| DATABASE_URL                  | Database connection URL   |                       |
| JWT_ACCESS_TOKEN_SECRET       | Access token secret       | min-32-chars          |
| JWT_REFRESH_TOKEN_SECRET      | Refresh token secret      | min-32-chars          |
| JWT_ISSUER                    | JWT issuer                | your-app-name         |
| JWT_AUDIENCE                  | JWT audience              | your-app-users        |

### Migrate Database

```bash
pnpm prisma db push
```

### Build Image & Running Container

```bash
docker build -t express/be-personal:latest .
docker run -d --name be-personal -p <port>:<port> express/be-personal:latest
```

## Enpoints

| Name                  | Method    | Endpoint              |
| --------------------- | --------- | --------------------- |
| Wellcome              | GET       | /                     |
|                       |           |                       |
| Register              | POST      | /auth/register        |
| Login                 | POST      | /auth/login           |
| Refresh Token         | POST      | /auth/token           |
| Logout                | POST      | /auth/logout          |
|                       |           |                       |
| Get Account           | GET       | /account              |
| Update Info           | PATCH     | /account/info         |
| Update Password       | PATCH     | /account/password     |
| Delete Account        | DELETE    | /account              |
|                       |           |                       |
| Send Message          | POST      | /messages             |
| Get Messages          | GET       | /messages             |
| Get Message           | GET       | /messages/:messageId  |
| Delete Message        | DELETE    | /messages/:messageId  |

## HTTP Status Code

| Status Code | Description                 |
| ----------- | --------------------------- |
| 200         | OK                          |
| 201         | Created                     |
| 400         | Bad Request                 |
| 401         | Unauthorized                |
| 403         | Forbidden                   |
| 404         | Not Found                   |
| 409         | Conflict                    |
| 500         | Internal Server Error       |