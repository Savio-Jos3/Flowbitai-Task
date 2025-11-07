# 📊 Flowbit AI - Full-Stack Invoice Analytics

A full-stack web app for managing, analyzing, and interacting with invoice documents. Built for the Flowbit Private Limited internship assessment.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white)

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Tech Stack](#-tech-stack)
* [Live Demo & Video](#-live-demo--video)
* [Key Features](#-key-features)
* [Architecture & Workflow](#-architecture--workflow)
* [Database Schema](#-database-schema)
* [Getting Started](#-getting-started)
* [API Documentation](#-api-documentation)
* [Bonus & Improvements](#-bonus--improvements)

---

## 📝 Overview

**Flowbit AI Invoice Analytics Dashboard** is a full-stack web app for managing, analyzing, and interacting with invoice documents. It supports file uploads, automated data extraction, dashboard-style analytics, and conversational queries using natural language.

This project features an interactive analytics dashboard and a "Chat with Data" interface powered by a self-hosted Vanna AI and Groq, all built on a modern, monorepo stack.

---

## 🔧 Tech Stack

* **Monorepo Tooling:** Turborepo (pnpm workspaces)
* **Frontend:** Next.js (TypeScript), shadcn/ui, TailwindCSS, Recharts
* **Backend:** Node.js (TypeScript), Express.js, Prisma
* **Database:** PostgreSQL
* **AI Layer:** Vanna AI (Python FastAPI), Groq LLM
* **Deployment:** Vercel (frontend/backend), Render/Fly.io (AI service)

---

## 🚀 Live Demo & Video

### Deployed URLs
* **Frontend (Vercel):** [**https://<your-app-name>.vercel.app**](https://<your-app-name>.vercel.app)
* **Backend API (Vercel):** [**https://<your-app-name>.vercel.app/api**](https://<your-app-name>.vercel.app/api)
* **Vanna AI (Render):** [**https://<your-vanna-service>.onrender.com**](https://<your-vanna-service>.onrender.com)

### 🎬 Demo Video
A 3-5 minute walkthrough of the application, from the dashboard to the "Chat with Data" feature.

[**Watch the Demo Video Here**](https://www.loom.com/...) _<-- (Add your Loom or YouTube link here)_

---

## ✨ Key Features

* **Interactive Dashboard:** A pixel-perfect recreation of the Figma design, displaying dynamic metrics:
    * Overview Cards (Total Spend, Invoices Processed, etc.)
    * Invoice Volume & Value Trends (Line Chart)
    * Spend by Vendor & Category (Bar/Pie Charts)
    * Cash Outflow Forecast
* **"Chat with Data":** A natural language interface to query the database.
    * Ask questions like: *"What's the total spend in the last 90 days?"*
    * Powered by a self-hosted **Vanna AI** service using **Groq** for SQL generation.
    * Displays the generated SQL query and the results in a table.
* **Full-Stack Architecture:**
    * **Turborepo** monorepo structure.
    * **Next.js (App Router)** frontend.
    * **Node.js (Express)** backend API.
    * **PostgreSQL** database with a normalized schema.
* **Data Ingestion:** A seed script to ingest and normalize the provided `Analytics_Test_Data.json`.

---

## 🏛️ Architecture & Workflow

### Project Workflow
This describes the full data lifecycle, from upload to analytics.

* **1. Upload:** User uploads invoice (e.g., PDF).
* **2. Extraction:** System extracts metadata and normalized invoice data.
* **3. Storage:** Data is stored in PostgreSQL using normalized tables.
* **4. API:** Backend REST APIs serve this data.
* **5. Dashboard:** Frontend dashboard displays analytics.
* **6. Chat:** “Chat with Data” uses the AI layer to answer questions.

**Key entities:** `Documents`, `Invoices`, `Vendors`, `Customers`, `Payments`, `Line Items`, `Invoice Summary`.

### "Chat with Data" Flow
This diagram illustrates how a natural language query is processed by the system.



1.  **Frontend (Next.js):** User types a query (e.g., "Top 5 vendors by spend").
2.  **Backend API (Express):** The query is sent to the `/api/chat-with-data` endpoint.
3.  **Proxy to AI Service:** The backend proxies this request to the self-hosted Vanna AI (FastAPI) service.
4.  **Vanna AI (Python):**
    * Uses Groq LLM to convert the query ("Top 5 vendors") into a SQL query.
    * Executes the generated SQL on the PostgreSQL database.
5.  **Response:** Vanna returns a JSON object containing the raw SQL, the data results, and (optionally) a chart suggestion.
6.  **Frontend:** Displays the generated SQL and the data (as a table or chart).

---

## 🗄️ Database Schema

### Entity-Relationship Diagram (ERD)
An ERD showing the normalized table structure. The design separates invoices from their related entities like vendors, customers, payments, and line items for data integrity.


_**(Add your ERD image here. You can create one on dbdiagram.io)**_

### DBML (Database Markup Language)
Below is the DBML code used to generate the schema.

```dbml
// Database Markup Language (DBML)
// Use a tool like dbdiagram.io to visualize this

Table documents {
  id uuid [pk]
  file_name varchar
  file_path varchar
  file_type varchar
  file_size int
  uploaded_by_id varchar
  uploaded_at timestamp
  organization_id varchar
  department_id varchar
  status varchar
}

Table vendors {
  id uuid [pk]
  name varchar
  tax_id varchar
  address varchar
  party_number varchar
}

Table customers {
  id uuid [pk]
  name varchar
  address varchar
}

Table invoices {
  id uuid [pk]
  invoice_number varchar
  document_id uuid [ref: > documents.id]
  vendor_id uuid [ref: > vendors.id]
  customer_id uuid [ref: > customers.id]
  invoice_date date
  delivery_date date
  status varchar
}

Table payments {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  payment_date date
  amount decimal
  bank_account varchar
  bic varchar
  payment_terms varchar
}

Table line_items {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  sr_no int
  description varchar
  quantity decimal
  unit_price decimal
  total_price decimal
  sachkonto varchar
  buschluessel varchar
}

Table invoice_summary {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  subtotal decimal
  total_tax decimal
  invoice_total decimal
  currency_symbol varchar
}

You are right, my apologies. The last version was a merge, but this one will be a complete, single file integrating all your specific text with the upgraded, filled-out sections.

This version includes your Table of Contents, your exact Overview and Architecture text, and all the "upgraded" elements (badges, demo links, detailed API docs, and setup steps) in one final README.md file.

Here is the complete, combined file.

Markdown

# 📊 Flowbit AI - Full-Stack Invoice Analytics

A full-stack web app for managing, analyzing, and interacting with invoice documents. Built for the Flowbit Private Limited internship assessment.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white)

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Tech Stack](#-tech-stack)
* [Live Demo & Video](#-live-demo--video)
* [Key Features](#-key-features)
* [Architecture & Workflow](#-architecture--workflow)
* [Database Schema](#-database-schema)
* [Getting Started](#-getting-started)
* [API Documentation](#-api-documentation)
* [Bonus & Improvements](#-bonus--improvements)

---

## 📝 Overview

**Flowbit AI Invoice Analytics Dashboard** is a full-stack web app for managing, analyzing, and interacting with invoice documents. It supports file uploads, automated data extraction, dashboard-style analytics, and conversational queries using natural language.

This project features an interactive analytics dashboard and a "Chat with Data" interface powered by a self-hosted Vanna AI and Groq, all built on a modern, monorepo stack.

---

## 🔧 Tech Stack

* **Monorepo Tooling:** Turborepo (pnpm workspaces)
* **Frontend:** Next.js (TypeScript), shadcn/ui, TailwindCSS, Recharts
* **Backend:** Node.js (TypeScript), Express.js, Prisma
* **Database:** PostgreSQL
* **AI Layer:** Vanna AI (Python FastAPI), Groq LLM
* **Deployment:** Vercel (frontend/backend), Render/Fly.io (AI service)

---

## 🚀 Live Demo & Video

### Deployed URLs
* **Frontend (Vercel):** [**https://<your-app-name>.vercel.app**](https://<your-app-name>.vercel.app)
* **Backend API (Vercel):** [**https://<your-app-name>.vercel.app/api**](https://<your-app-name>.vercel.app/api)
* **Vanna AI (Render):** [**https://<your-vanna-service>.onrender.com**](https://<your-vanna-service>.onrender.com)

### 🎬 Demo Video
A 3-5 minute walkthrough of the application, from the dashboard to the "Chat with Data" feature.

[**Watch the Demo Video Here**](https://www.loom.com/...) _<-- (Add your Loom or YouTube link here)_

---

## ✨ Key Features

* **Interactive Dashboard:** A pixel-perfect recreation of the Figma design, displaying dynamic metrics:
    * Overview Cards (Total Spend, Invoices Processed, etc.)
    * Invoice Volume & Value Trends (Line Chart)
    * Spend by Vendor & Category (Bar/Pie Charts)
    * Cash Outflow Forecast
* **"Chat with Data":** A natural language interface to query the database.
    * Ask questions like: *"What's the total spend in the last 90 days?"*
    * Powered by a self-hosted **Vanna AI** service using **Groq** for SQL generation.
    * Displays the generated SQL query and the results in a table.
* **Full-Stack Architecture:**
    * **Turborepo** monorepo structure.
    * **Next.js (App Router)** frontend.
    * **Node.js (Express)** backend API.
    * **PostgreSQL** database with a normalized schema.
* **Data Ingestion:** A seed script to ingest and normalize the provided `Analytics_Test_Data.json`.

---

## 🏛️ Architecture & Workflow

### Project Workflow
This describes the full data lifecycle, from upload to analytics.

* **1. Upload:** User uploads invoice (e.g., PDF).
* **2. Extraction:** System extracts metadata and normalized invoice data.
* **3. Storage:** Data is stored in PostgreSQL using normalized tables.
* **4. API:** Backend REST APIs serve this data.
* **5. Dashboard:** Frontend dashboard displays analytics.
* **6. Chat:** “Chat with Data” uses the AI layer to answer questions.

**Key entities:** `Documents`, `Invoices`, `Vendors`, `Customers`, `Payments`, `Line Items`, `Invoice Summary`.

### "Chat with Data" Flow
This diagram illustrates how a natural language query is processed by the system.



1.  **Frontend (Next.js):** User types a query (e.g., "Top 5 vendors by spend").
2.  **Backend API (Express):** The query is sent to the `/api/chat-with-data` endpoint.
3.  **Proxy to AI Service:** The backend proxies this request to the self-hosted Vanna AI (FastAPI) service.
4.  **Vanna AI (Python):**
    * Uses Groq LLM to convert the query ("Top 5 vendors") into a SQL query.
    * Executes the generated SQL on the PostgreSQL database.
5.  **Response:** Vanna returns a JSON object containing the raw SQL, the data results, and (optionally) a chart suggestion.
6.  **Frontend:** Displays the generated SQL and the data (as a table or chart).

---

## 🗄️ Database Schema

### Entity-Relationship Diagram (ERD)
An ERD showing the normalized table structure. The design separates invoices from their related entities like vendors, customers, payments, and line items for data integrity.


_**(Add your ERD image here. You can create one on dbdiagram.io)**_

### DBML (Database Markup Language)
Below is the DBML code used to generate the schema.

```dbml
// Database Markup Language (DBML)
// Use a tool like dbdiagram.io to visualize this

Table documents {
  id uuid [pk]
  file_name varchar
  file_path varchar
  file_type varchar
  file_size int
  uploaded_by_id varchar
  uploaded_at timestamp
  organization_id varchar
  department_id varchar
  status varchar
}

Table vendors {
  id uuid [pk]
  name varchar
  tax_id varchar
  address varchar
  party_number varchar
}

Table customers {
  id uuid [pk]
  name varchar
  address varchar
}

Table invoices {
  id uuid [pk]
  invoice_number varchar
  document_id uuid [ref: > documents.id]
  vendor_id uuid [ref: > vendors.id]
  customer_id uuid [ref: > customers.id]
  invoice_date date
  delivery_date date
  status varchar
}

Table payments {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  payment_date date
  amount decimal
  bank_account varchar
  bic varchar
  payment_terms varchar
}

Table line_items {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  sr_no int
  description varchar
  quantity decimal
  unit_price decimal
  total_price decimal
  sachkonto varchar
  buschluessel varchar
}

Table invoice_summary {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  subtotal decimal
  total_tax decimal
  invoice_total decimal
  currency_symbol varchar
}

🚀 Getting Started
Prerequisites
Node.js v18+

pnpm

Docker (for PostgreSQL, optional)

Python 3.10+

A Groq API Key

1. Clone the Repository
Bash

git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
cd <your-repo-name>
2. Install Dependencies
Bash

pnpm install
3. Set Up Environment Variables
Create .env files in the respective packages. Start with /apps/api/.env.example, /apps/web/.env.example, and /services/vanna/.env.example.

Backend (/apps/api/.env)

Bash

# PostgreSQL connection string
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# URL of your deployed Vanna service
VANNA_API_BASE_URL="http://localhost:8000" # (Update to Render URL when deployed)
Vanna AI (/services/vanna/.env)

Bash

# Must use psycopg protocol for Vanna
DATABASE_URL="postgresql+psycopg://user:pass@host:5432/dbname"
GROQ_API_KEY="sk-..."
PORT=8000
4. Set Up and Seed the Database
Start your PostgreSQL server (e.g., via Docker).

Run the Prisma migrations to create the tables:

Bash

pnpm --filter=api run db:migrate
Run the seed script to ingest data from Analytics_Test_Data.json:

Bash

pnpm --filter=api run db:seed
5. Run the Application
This will start the entire monorepo (frontend, backend, and AI service).

Bash

pnpm dev
Frontend will be available at http://localhost:3000

Backend API will be available at http://localhost:3001

Vanna AI Service will be available at http://localhost:8000

📚 API Documentation
Base URL: /api
📊 Dashboard Stats
Endpoint: /stats

Method: GET

Description: Returns totals for the overview cards.

Example Response:

JSON

{
  "total_spend_ytd": 125000.00,
  "total_invoices_processed": 1500,
  "documents_uploaded": 500,
  "average_invoice_value": 83.33
}
📈 Invoice Trends
Endpoint: /invoice-trends

Method: GET

Description: Returns data for the "Invoice Volume + Value Trend" line chart.

Example Response:

JSON

[
  { "month": "Jan", "volume": 100, "value": 10000 },
  { "month": "Feb", "volume": 120, "value": 12000 },
  { "month": "Mar", "volume": 110, "value": 11000 }
]
🏢 Top Vendors
Endpoint: /vendors/top10

Method: GET

Description: Returns the top 10 vendors by total spend.

Example Response:

JSON

[
  { "vendor_name": "Vendor A", "spend": 25000 },
  { "vendor_name": "Vendor B", "spend": 18000 }
]
🥧 Spend by Category
Endpoint: /category-spend

Method: GET

Description: Returns total spend grouped by line_item category.

Example Response:

JSON

[
  { "category": "Software", "spend": 30000 },
  { "category": "Hardware", "spend": 45000 },
  { "category": "Marketing", "spend": 15000 }
]
💸 Cash Outflow
Endpoint: /cash-outflow

Method: GET

Description: Returns data for the cash outflow forecast bar chart.

Example Response:

JSON

[
  { "date": "2025-11-10", "amount_due": 5000 },
  { "date": "2025-11-15", "amount_due": 8000 }
]
📄 Invoices Table
Endpoint: /invoices

Method: GET

Description: Returns a paginated, searchable list of invoices.

Query Params: ?page=1&limit=10&search=...&sortBy=date&order=desc

Example Response:

JSON

{
  "data": [
    {
      "id": "uuid-...",
      "vendor_name": "Vendor C",
      "date": "2025-11-01",
      "invoice_number": "INV-1001",
      "amount": 150.00,
      "status": "Paid"
    }
  ],
  "total_count": 1500
}
💬 Chat with Data
Endpoint: /chat-with-data

Method: POST

Description: Forwards a natural language query to the Vanna AI service.

Body:

JSON

{
  "query": "What's the total spend in the last 90 days?"
}
Example Response:

JSON

{
  "sql_query": "SELECT SUM(total_price) FROM line_items WHERE invoice_id IN (SELECT id FROM invoices WHERE invoice_date >= NOW() - INTERVAL '90 days')",
  "results": [
    { "sum": 25000.00 }
  ],
  "chart_suggestion": null
}
🏆 Bonus & Improvements
This section details any enhancements made beyond the baseline requirements.

[ ] Persistent Chat History: (e.g., saving chats to the DB)

[ ] CSV / Excel Export: (e.g., for the invoices table)

[ ] Unit Tests: (e.g., using Jest for API endpoints)

[ ] Docker Compose: (e.g., docker-compose.yml for a one-command local setup)