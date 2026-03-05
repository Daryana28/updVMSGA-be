import express from "express";
import { getParkingIntegration } from "../controller/Integration/getParkingIntegration.js";
import { verifyIntegrationApiKey } from "../middleware/verifyIntegrationApiKey.js";

const integrationRoutes = express.Router();

integrationRoutes.get("/parking", verifyIntegrationApiKey, getParkingIntegration);

export default integrationRoutes;

