// ===============================================================================
// DEPENDENCIES
// ===============================================================================
import express from "express";


// ===============================================================================
// SERVICES
// ===============================================================================
import WellcomeController from "../services/wellcome/wellcome.controller.js";
import AuthController from "../services/auth/auth.controller.js";
import AccountController from "../services/account/account.controller.js";


// ===============================================================================
// MIDDLEWARE
// ===============================================================================
import AuthenticatedMiddleware from "../middlewares/authenticated.middleware.js";


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

API.get("/account", AuthenticatedMiddleware, AccountController.getAccount);
API.patch("/account/info", AuthenticatedMiddleware, AccountController.updateInfo);
API.patch("/account/password", AuthenticatedMiddleware, AccountController.updatePassword);
API.delete("/account", AuthenticatedMiddleware, AccountController.deleteAccount);


// ===============================================================================
// EXPORT
// ===============================================================================
export default API;