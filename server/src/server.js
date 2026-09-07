import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "RuralCare Connect API",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "RuralCare Connect API"
  });
});

app.get("/api/doctors", (req, res) => {
  res.json([
    {
      id: "d1",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine"
    },
    {
      id: "d2",
      name: "Dr. Arjun Rao",
      specialty: "Pediatrics"
    },
    {
      id: "d3",
      name: "Dr. Meera Singh",
      specialty: "Women's Health"
    }
  ]);
});

app.get("/api/tokens", (req, res) => {
  res.json([
    {
      id: "t1",
      number: "RC-024",
      patient: "Sravani Reddy",
      doctor: "Dr. Priya Sharma",
      position: 5,
      wait: 25,
      status: "Waiting"
    }
  ]);
});

app.post("/api/register", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Patient registered successfully",
    patient: req.body
  });
});

app.post("/api/tokens", (req, res) => {
  res.status(201).json({
    success: true,
    token: {
      number: "RC-025",
      patient: req.body.patient || "Patient",
      doctor: "Dr. Priya Sharma",
      position: 6,
      wait: 30,
      status: "Waiting"
    }
  });
});

app.get("/api/admin/summary", (req, res) => {
  res.json({
    patients: 1250,
    doctors: 50,
    todayConsultations: 72,
    pendingConsultations: 7,
    activeTokens: 12,
    completed: 54,
    physicalReferrals: 8
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RuralCare API running on port ${PORT}`);
});
