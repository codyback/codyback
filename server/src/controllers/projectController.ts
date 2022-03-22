import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Project } from "../models/projectModel";
import mongoose from "mongoose";

/**
 * GET - /api/projects
 * Returns an array of all project objects
 */
const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find();

  res.status(200).json({
    projects,
  });
});

/**
 * GET - /api/projects/{id}
 * Returns a single project object by _id
 */
const getProject = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) projectNotFoundError(res);
  const project = await Project.findById(req.params.id);

  if (!project) projectNotFoundError(res);

  res.status(200).json(project);
});

/**
 * POST - /api/projects/
 * Create a project document and inserts it into the database
 * Requires a complete project document in the request body
 * @protected - needs a user signed in with role admin
 * @returns a project document with the generated _id
 */
const addProject = asyncHandler(async (req: any, res: Response) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a name field");
  }

  checkUserPermissions(req, res, "ADMIN", "User is not authorized to create projects");

  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    repo: req.body.repo,
    demoURL: req.body.demoURL,
  });

  res.status(200).json(project);
});

/**
 * PUT - /api/projects/{id}
 * Updates a project document in place of an existing project
 * Requires a complete project document and the _id of the document to change
 * @returns an updated project document with the changes
 */
const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) projectNotFoundError(res);

  checkUserPermissions(req, res, "ADMIN", "User is not authorized to update projects");

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedProject);
});

/**
 * DELETE - /api/projects/{id}
 * Deletes a project document from an _id
 */
const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) projectNotFoundError(res);
  const project = await Project.findById(req.params.id);

  if (!project) projectNotFoundError(res);

  checkUserPermissions(req, res, "ADMIN", "User is not authorized to delete projects");

  await project.remove();

  res.status(200).json({ id: req.params.id });
});

const projectNotFoundError = (res: Response) => {
  res.status(400);

  throw new Error("Project not found");
};

const checkUserPermissions = (req: any, res: any, role: String, errorString: string) => {
  if (req.user.role !== role) {
    res.status(401);

    throw new Error(errorString);
  }
};

export { getProjects, getProject, addProject, updateProject, deleteProject };
