import { Router } from "express";
import UserRoute from "./user.route";

const MainRoute = Router();
MainRoute.use("/users", UserRoute);

export default MainRoute;