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
