import express from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomerStats,
  //searchCustomers ,
} from "../controller/customerController.js";

const router = express.Router();

router.route("/").post(createCustomer).get(getCustomers);
router.route("/stats").get(getCustomerStats);
router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);
//router.route("/search").get(searchCustomers);

export default router;