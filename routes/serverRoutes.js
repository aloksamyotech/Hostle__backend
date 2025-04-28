import express from "express";
const router = express.Router();

import AdministratorRoute from "./administratorRoutes.js";
import StudentRoute from "./studentRoutes.js";
import HostelRoute from "./hostelRoutes.js";
import StudentReservationRoute from "./studentReservationRoutes.js";
import RoomRoute from "./roomRoutes.js";
import StudentComplaintRoute from "./studentComplaintRoutes.js";
import VisitorRoute from "./visitorRoutes.js";
import AttendenceRoute from "./attendenceRoutes.js";
import CanteenInventoryRoute from "./canteenInventoryRoutes.js";
import CanteenInventoryPurchesRoute from "./canteenInventoryPurchesRoutes.js";
import CanteenInventoryConsumeRoute from "./canteenInventoryConsumeRoutes.js";
import ExpenditureRoute from "./expenseRoutes.js";
import NoticeBoardRoute from "./noticeBoardRoutes.js";
import WeeklyFoodMenuRoute from "./weeklyFoodMenuRoutes.js";
import StudentPaymentRoute from "./studentPaymentRoutes.js";
import RoomTypes from "./roomTypes.js";

router.use("/administrator", AdministratorRoute);
router.use("/hostel", HostelRoute);
router.use("/student", StudentRoute);
router.use("/sudent_reservation", StudentReservationRoute);
router.use("/room", RoomRoute);
router.use("/student_complaint", StudentComplaintRoute);
router.use("/visitor", VisitorRoute);
router.use("/attendence", AttendenceRoute);
router.use("/canteen_inventory", CanteenInventoryRoute);
router.use("/canteen_inventory_purches", CanteenInventoryPurchesRoute);
router.use("/canteen_inventory_consume", CanteenInventoryConsumeRoute);
router.use("/expense", ExpenditureRoute);
router.use("/notice_board", NoticeBoardRoute);
router.use("/weeklyfoodmenu", WeeklyFoodMenuRoute);
router.use("/student_payment", StudentPaymentRoute);
router.use("/roomTypes", RoomTypes);

export default router;
