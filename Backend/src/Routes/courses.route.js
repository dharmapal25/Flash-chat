const express = require("express");

const UserRoutes = express.Router();

UserRoutes.get("/courses",viewCourses);