## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Donor+ Application Overview

Donor+ is a cross-platform mobile application designed to connect blood donors and recipients in real-time based on blood type, preference, and geographic proximity. It simplifies the donation process and enables timely access to critical help.


---

## Tech Stack

- **Frontend (Mobile)**: React Native (iOS + Android)
- **Backend**: Next.js (API Routes)
- **Database**: MongoDB Atlas
- **Location Services**: OpenStreetMap (OSM API)
- **Containerization**: Docker
- **Deployment**: AWS (ECR + ECS)

---

## System Architecture

```text
[Mobile App (React Native)] ⇄ [Backend API (Next.js)] ⇄ [MongoDB Atlas]
             |
             v
        [OSM API]
