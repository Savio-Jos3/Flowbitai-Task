# 💡 Flowbit AI Analytics Dashboard & Chat

> ⚡ A full-stack AI-powered analytics platform for natural language data exploration, visualization, and real-time insights.

---

## 📚 Table of Contents

1. [🚀 Project Overview](#-project-overview)  
2. [✨ Features](#-features)  
3. [🧠 Tech Stack](#-tech-stack)  
4. [📁 Project Structure](#-project-structure)  
5. [⚙️ Setup & Installation](#️-setup--installation)  
6. [🗄️ Database Setup](#️-database-setup)  
7. [📡 API Documentation](#-api-documentation)  
8. [💬 Chat With Data Integration](#-chat-with-data-integration)  
9. [🔒 Security & Authentication](#-security--authentication)  
10. [🚨 Error Handling](#-error-handling)  
11. [🤝 Contribution Guidelines](#-contribution-guidelines)  
12. [📜 License](#-license)

---

## 🚀 Project Overview

**Flowbit AI Analytics Dashboard & Chat** is a production-grade full-stack web application for **interactive analytics** and **natural-language data querying**.  

It transforms complex invoice and vendor data into **actionable visualizations** and **AI-driven insights**, powered by **self-hosted Vanna AI** and **Groq LLM**.  

> 💬 Unlike static reporting tools, Flowbit enables real-time, natural-language queries with secure backend processing and responsive chart updates.

---

## ✨ Features

✅ Pixel-perfect **dashboard** faithfully replicating the original Figma design  
📊 Dynamic **overview cards** for key business metrics  
📈 Interactive **charts** (line, bar, pie, donut) for trends and forecasts  
🧾 **Invoice table** with sorting, searching, and detailed vendor data  
💬 **AI-powered chat** for natural language SQL querying  
🔗 RESTful **API endpoints** for analytical data retrieval  
📦 **Monorepo architecture** using Turborepo or npm workspaces  
🚀 Deployment-ready for **Vercel** and self-hosted AI environments  

---

## 🧠 Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Recharts |
| **Backend** | Node.js (TypeScript), Express.js / Next.js API routes, Prisma ORM |
| **Database** | PostgreSQL |
| **AI Layer** | Vanna AI (Python FastAPI/Flask), Groq LLM |
| **Dev Tools** | Turborepo, pnpm/npm, Docker Compose |

---

## 📁 Project Structure

```plaintext
Flowbit-Task/
├─ apps/
│  ├─ api/         # Express.js TypeScript backend
│  └─ web/         # Next.js frontend
├─ data/
│  ├─ Analytics_Test_Data.json  # Dataset
│  └─ docker-compose.yml        # PostgreSQL container
├─ packages/
│  └─ db/
│     ├─ prisma/                # Prisma schema, migrations, seed script
│     └─ .env                   # Database environment file
├─ services/
│  └─ vanna/                    # Python AI service (Vanna)


## ⚙️ Setup & Installation

---

### 🧩 Prerequisites

- **PostgreSQL 13+** (local or Docker)
- **Node.js 18+**
- **pnpm** (or npm/yarn)
- **Python 3.9+** for Vanna AI

---

### 🛠️ Steps

#### 1️⃣ Install dependencies
```bash
pnpm install


⚙️ Setup & Installation
🛠️ Steps
2️⃣ Start PostgreSQL (via Docker)
cd data
docker compose up -d

3️⃣ Seed the Database
pnpm tsx packages/db/prisma/seed.ts

4️⃣ Run Backend & Frontend

Backend

pnpm --filter @flowbit/api dev


Frontend

pnpm --filter @flowbit/web dev

5️⃣ Start the AI Service
cd services/vanna
python app.py

🗄️ Database Setup

Follow these commands for a full local setup:

docker compose up -d
pnpm tsx packages/db/prisma/seed.ts


The .env file in packages/db must match the credentials in docker-compose.yml.
It will create normalized tables and load data from Analytics_Test_Data.json.

🧩 Default Connection Details
Parameter	Value
Host	localhost
Port	5432
User	postgres
Password	postgres
Database	flowbit
📡 API Documentation

Base URL: http://localhost:3001/api

Method	Endpoint	Description
GET	/stats	Retrieve dashboard summary metrics
GET	/invoice-trends	Get monthly invoice trends
GET	/vendors/top10	Top 10 vendors by spend
GET	/category-spend	Spending breakdown by category
GET	/cash-outflow	Forecasted outflow trends
GET	/invoices	Searchable invoice list
POST	/chat-with-data	AI natural language querying

📄 See API.md for example responses and schema definitions.

💬 Chat With Data Integration
🧠 Architecture Flow

Frontend chat UI captures user queries

JWT-authenticated request sent to backend

Backend securely proxies request to Vanna AI service

Vanna AI:

Reads schema

Builds structured LLM prompt

Uses Groq LLM for SQL generation

Executes queries on PostgreSQL

Frontend renders SQL + table/chart results in real time

🔐 This design ensures data privacy and modular AI integration.

🔒 Security & Authentication

🔑 JWT-based authentication between frontend & backend

🧱 Middleware-enforced route protection

🧠 Internal-only access to Vanna AI service

💾 Tokens securely stored and refreshed on the client side

🚨 Error Handling

⚠️ Graceful frontend error states (401, 404, 500)

🧾 Unified backend error response schema

🧩 Structured AI error logging and recovery

💬 User-friendly messages for failed queries

🤝 Contribution Guidelines

Contributions are welcome! ❤️

Fork the repository

Create a feature branch

Commit your changes

Open a pull request

Please follow existing coding conventions and linting setup.

🐞 Found a bug? Open an issue with clear reproduction steps.

📜 License

This project is released under the MIT License.
See the LICENSE
 file for full terms.