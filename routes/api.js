// ===============================================================================
// DEPENDENCIES
// ===============================================================================
import express from "express";


// ===============================================================================
// SERVICES
// ===============================================================================
import WellcomeController from "../services/wellcome/wellcome.controller.js";
import AuthController from "../services/auth/auth.controller.js";


// ===============================================================================
// INITIALIZATION
// ===============================================================================
const API = express.Router();


// ===============================================================================
// LIST ENDPOINT
// ===============================================================================
API.get("/", WellcomeController.index);

API.post("/auth/register", AuthController.register);
API.post("/auth/login", AuthController.login);
API.post("/auth/token", AuthController.refresh_token);
API.post("/auth/logout", AuthController.logout);


// ===============================================================================
// EXPORT
// ===============================================================================
export default API;