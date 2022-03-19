import express, { Router } from "express";
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const route = Router();

route.route("/").get(getProjects).post(protect, addProject);
route.route("/:id").get(getProject).put(protect, updateProject).delete(protect, deleteProject);

module.exports = route;
