import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;

    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    service: "RuralCare Connect API",
    status: "running"
  });
});
const medicalReports = [];
app.post("/api/reports/upload", upload.single("report"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No medical report file uploaded"
    });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const report = {
  id: "REP-" + Date.now(),
  patientId: req.body.patientId,
  patientName: req.body.patientName,
  doctorName: req.body.doctorName,
  originalName: req.file.originalname,
  fileName: req.file.filename,
  fileType: req.file.mimetype,
  fileSize: req.file.size,
  url: fileUrl,
  uploadedAt: new Date().toISOString()
};

medicalReports.push(report);

  res.status(201).json({
    success: true,
    message: "Medical report uploaded successfully",
    report: {
      patientId: req.body.patientId,
      patientName: req.body.patientName,
      doctorName: req.body.doctorName,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      url: fileUrl,
      uploadedAt: new Date().toISOString()
    }
  });
});
app.get("/api/reports", (req, res) => {
  const patientId = req.query.patientId;

  if (patientId) {
    return res.json(
      medicalReports.filter(report => report.patientId === patientId)
    );
  }

  res.json(medicalReports);
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "RuralCare Connect API"
  });
});
const appointments = [];

app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

app.post("/api/appointments", (req, res) => {
  const appointment = {
    id: "APT-" + Date.now(),
    doctor: req.body.doctor,
    date: req.body.date,
    time: req.body.time,
    mode: req.body.mode,
    reason: req.body.reason || "",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  };

  appointments.push(appointment);

  res.status(201).json({
    ok: true,
    message: "Appointment booked successfully",
    appointment
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
app.get("/api/doctor/summary", (req, res) => {
  res.json({
    todayTokens: 18,
    waiting: 7,
    completed: 9,
    referrals: 2
  });
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
    physicalReferrals: 8,
    ruralUsage: 64
  });
});

const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("Video call client connected:", socket.id);
  socket.on("join-chat-room", (roomId) => {
    socket.join(roomId);
    console.log("Chat client joined room:", roomId);
  });

  socket.on("chat-message", ({ roomId, message, senderRole, senderName }) => {
    if (!roomId || !message) return;

    io.to(roomId).emit("chat-message", {
      message,
      senderRole,
      senderName,
      timestamp: new Date().toISOString()
    });
  });
  socket.on("join-video-room", (roomId) => {
    socket.join(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const participantCount = room ? room.size : 0;

    socket.emit("room-joined", {
      roomId,
      participantCount
    });

    socket.to(roomId).emit("participant-joined", {
      socketId: socket.id
    });
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", {
      offer,
      socketId: socket.id
    });
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", {
      answer,
      socketId: socket.id
    });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", {
      candidate,
      socketId: socket.id
    });
  });

  socket.on("leave-video-room", (roomId) => {
    socket.leave(roomId);

    socket.to(roomId).emit("participant-left", {
      socketId: socket.id
    });
  });

  socket.on("disconnect", () => {
    console.log("Video call client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`RuralCare API + Video Signaling running on port ${PORT}`);
});
