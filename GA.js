import https from "https";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { Server } from "socket.io";
import mainRoutes from "./routes/mainRoutes.js";
import { setupSocketHandlers } from "./socket/handlers/index.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5010);

const allowedOrigins = [
  "https://pik1com074.local.ikoito.co.id:449",
  "https://pik1com074.local.ikoito.co.id:3000",
  "https://pik1com074.local.ikoito.co.id:5010",
  "https://pik1com191.local.ikoito.co.id:449",
  "https://pik1com191.local.ikoito.co.id:3000",
  "https://pik1com191.local.ikoito.co.id:5010",
  "https://pik1svr008.local.ikoito.co.id:449",
  "https://localhost:449",
  "https://localhost:3000",
  "https://localhost:5010",
  "http://localhost:3000",
];

const certCandidates = [
  { key: "./cert/private.key", cert: "./cert/certificate.cer" },
  { key: "./cert/pik1com074/private.key", cert: "./cert/pik1com074/certificate.cer" },
  { key: "./cert/New folder/private.key", cert: "./cert/New folder/certificate.crt" },
];

const resolvedPair = certCandidates.find(
  (pair) => fs.existsSync(pair.key) && fs.existsSync(pair.cert)
);

if (!resolvedPair) {
  console.error("SSL certificate files not found. Checked candidates:", certCandidates);
  process.exit(1);
}

const sslOptions = {
  key: fs.readFileSync(resolvedPair.key),
  cert: fs.readFileSync(resolvedPair.cert),
};

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "andan",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    },
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port,
  });
});

app.use("/", mainRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[Error]", err?.message || err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const server = https.createServer(sslOptions, app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

setupSocketHandlers(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`HTTPS Server running on 0.0.0.0:${port}`);
});

server.on("error", (err) => {
  console.error("Failed starting HTTPS server:", err);
});
