# NC Take Home Assignment – Backend

This directory contains the backend implementation for the NC Take Home Assignment.  
The backend is built using Node.js, Express, and MongoDB (Mongoose) and is designed to be production-ready, scalable, and easy to audit.

It implements user authentication, investment management, daily ROI calculation, multi-level referral income, and scheduled background jobs.

## Tech Stack

- Runtime: Node.js (ES Modules)
- Framework: Express.js
- Database: MongoDB Atlas
- ODM: Mongoose
- Authentication: JWT (JSON Web Token)
- Scheduler: node-cron
- Environment Configuration: dotenv
- Package Manager: pnpm

## Project Structure

```

apps/api/src
├── cron/
│   └── dailyRoi.cron.js
├── db/
│   └── db.connect.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── User.model.js
│   ├── Investment.model.js
│   ├── ROIHistory.model.js
│   └── ReferralIncome.model.js
├── routes/
│   ├── auth.routes.js
│   ├── investment.routes.js
│   ├── dashboard.routes.js
│   └── referral.routes.js
├── services/
│   ├── roi.service.js
│   └── referral.service.js
└── index.js

```

## Core Domain Models

### User
- Stores authentication credentials
- Maintains wallet balance
- Stores aggregated totals (total investment, total ROI, referral income)
- Uses a self-referencing `referrer` field to build the referral hierarchy

### Investment
- Linked to a user
- Stores amount, plan, ROI percentage
- Contains start and end dates
- Tracks investment status (`ACTIVE`, `COMPLETED`)

### ROIHistory
- Stores daily ROI entries per investment
- Enforces idempotency using a unique index on `(investment, date)`
- Acts as an audit log for ROI calculations

### ReferralIncome
- Stores level-based referral income
- Tracks `fromUser`, `toUser`, level, and amount
- Used for audit and dashboard aggregation

## Authentication

- JWT-based authentication
- Token must be sent in the `Authorization` header as `Bearer <token>`
- Protected routes use a dedicated authentication middleware

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |

### Investments
| Method | Endpoint | Description |
|------|----------|-------------|
| POST | `/investments` | Create a new investment |
| GET | `/investments/me` | Fetch logged-in user investments |

### Dashboard
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/dashboard` | Fetch dashboard summary |
| GET | `/dashboard/daily-roi` | Fetch today’s ROI |
| GET | `/dashboard/roi-history` | Fetch ROI history for charts |

### Referrals
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/referrals/tree` | Fetch nested referral tree |

### Health Check
| Method | Endpoint |
|------|----------|
| GET | `/health` |

## Cron Job – Daily ROI

The system uses a scheduled cron job to calculate ROI.

### Responsibilities
- Runs daily at midnight
- Calculates ROI for all active investments
- Distributes referral income
- Updates wallet balances
- Marks expired investments as completed

### Cron Location
```

src/cron/dailyRoi.cron.js

````

## Cron Control via Environment Variable

Cron execution is controlled using an environment variable:

```env
ENABLE_CRON=true
````

* `true` enables cron execution (production)
* `false` disables cron execution (local or development)

This prevents duplicate cron execution in multi-instance deployments.

## Idempotency Design

The ROI calculation is idempotent by design.

* Each daily ROI entry is recorded in `ROIHistory`
* A unique database index on `(investment, date)` prevents duplicates
* Wallet balances are updated only after successful history insertion

This guarantees that rerunning the cron job does not result in double crediting.

## Environment Variables

Create a `.env` file in `apps/api`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nc-take-home-assignment
JWT_SECRET=supersecretjwtkey
ENABLE_CRON=false
```

Environment files must not be committed to version control.

---

## Running Locally

From the repository root:

```bash
pnpm install
pnpm --filter @nc/api dev
```

The server will start on:

```
http://localhost:3000
```

---

## Deployment Overview

### Backend

* Deployed on Render as a long-running Node.js service
* Supports persistent MongoDB connections and cron jobs

### Frontend

* Deployed separately on Vercel
* Communicates with the backend via an environment-based API URL

---

## Testing

APIs can be tested using:

* curl
* Postman
* The frontend dashboard

Test credentials are displayed on the frontend UI for demonstration purposes.

---

## Design Principles

* Clear separation of concerns
* Thin route handlers with a dedicated service layer
* Audit-friendly financial records
* Idempotent background jobs
* Environment-driven configuration