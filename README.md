# RuralCare Connect

A polished, responsive healthcare-support hackathon prototype with patient, doctor and admin dashboards, digital token flow, medical-report timeline/comparison, follow-up UI, emergency messaging, multilingual selector, and a video-consultation UI.

## Run locally
Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```
Frontend: http://localhost:5173
Backend: http://localhost:4000/api/health

## Build frontend
```bash
npm run build
```

## Deploy
### Frontend
Deploy the `client` folder to Vercel/Netlify/Cloudflare Pages. Set `VITE_API_URL` to the deployed backend URL plus `/api`.

### Backend
Deploy the `server` folder to Render/Railway/Fly.io or another Node hosting provider. Set `PORT` if your host requires it.

## Video consultation
The current video consultation is a production-style UI mockup, intentionally not a real medical video service. For a real deployment, replace `VideoModal` with a compliant WebRTC/video provider and configure authentication, consent, encryption, audit logging, retention policies, and healthcare/privacy requirements for your jurisdiction.

## Production security checklist
This repository is a hackathon-ready starter, not a certified medical-record system. Before handling real patient data, add real authentication (OIDC/Auth0/Clerk/Supabase Auth), PostgreSQL, encrypted object storage, server-side authorization on every patient/report resource, HTTPS, audit logs, secure sessions, rate limiting, malware scanning for uploads, backups, consent/privacy flows, and a compliant video provider.

The emergency button intentionally tells users to seek immediate physical care; the application does not diagnose diseases automatically.
