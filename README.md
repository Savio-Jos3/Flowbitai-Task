# 📊 Flowbit AI - Full-Stack Invoice Analytics

**A production-grade, full-stack web application built for the Flowbit Private Limited internship assessment.**

This project features an interactive analytics dashboard and a "Chat with Data" interface powered by a self-hosted Vanna AI and Groq, all built on a modern, monorepo stack.

---

## 🚀 Live Demo URLs

* **Frontend (Vercel):** [**https://<your-app-name>.vercel.app**](https://<your-app-name>.vercel.app)
* **Vanna AI (Render):** [**https://<your-vanna-service>.onrender.com**](https://<your-vanna-service>.onrender.com)

## 🎬 Demo Video

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

## 🔧 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Monorepo** | ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white) |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) |
| **AI Layer** | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black) |

---

## 🏛️ Architecture & Workflow

### Chat-with-Data Flow

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

## Database Schema

An ERD (Entity-Relationship Diagram) showing the normalized table structure. The design separates invoices from their related entities like vendors, customers, payments, and line items for data integrity.


_**(Add your ERD image here. You can create one on dbdiagram.io)**_

Below is the DBML (Database Markup Language) code used to generate the schema.

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