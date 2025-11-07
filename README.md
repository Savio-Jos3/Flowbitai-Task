# Flowbitai-Task
Overview
This project is a production-grade full-stack web application designed to manage, analyze, and interact with real-world invoice documents. It enables organizations to upload invoice PDFs, automatically extract and normalize relevant data, visualize metrics via a dashboard, and query data using natural language through an AI interface.

Tech Stack
Frontend: Next.js (TypeScript), shadcn/ui, TailwindCSS, Recharts

Backend: Node.js (TypeScript), Express.js, REST API, Prisma ORM

Database: PostgreSQL

AI Layer: Vanna AI (Python FastAPI), Groq LLM

Deployment: Vercel (frontend & backend), Render/Fly.io (AI service)

Monorepo Tooling: Turborepo (pnpm workspaces)

Architecture / Workflow Diagram
Documents Table: stores uploaded invoice files and related metadata.

Invoices Table: normalized invoice data linked to document, vendor, and customer.

Vendors Table: supplier information.

Customers Table: purchaser information.

Line Items Table: each product/service line from invoices.

Payments Table: payment details, if present.

Invoice Summary Table: calculated subtotals, tax, and grand total per invoice.

Example Workflow:
User uploads invoice PDF

System extracts metadata and normalized data

Data stored in multiple normalized tables (see ER Diagram below)

Data served through backend REST APIs

Dashboard displays analytics and invoice details

"Chat with Data" interface leverages AI to answer queries about invoices

Database Schema
Below is the initial Entity-Relationship (ER) Diagram:

text
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
How to Run Locally
(Detailed instructions will be added in Phase 1)

Install dependencies using pnpm install

Set up PostgreSQL instance and environment variables

Run database migrations & seed scripts to ingest JSON

Start frontend (apps/web) and backend (apps/api) separately

Configure AI service URLs for "Chat with Data" interface

API Documentation
(To be populated as endpoints are completed during Phase 2)

/api/stats — Returns dashboard totals

/api/invoice-trends — Monthly invoice analytics

/api/vendors/top10 — Top vendors by spend

/api/category-spend — Spend grouped by category

/api/cash-outflow — Forecast data

/api/invoices — Invoices table (search/filter)

/api/chat-with-data — Natural language analytics

Deployment URLs
(To be added in Phase 5)

Frontend: https://yourapp.vercel.app

Backend: https://yourapp.vercel.app/api

AI Service: https://your-vanna-host.onrender.com