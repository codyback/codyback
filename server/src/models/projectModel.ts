import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  repo: {
    type: String,
    required: [true, "Please add a repo url"],
  },
  demoURL: String,
});

export const Project = mongoose.model("Project", projectSchema);
