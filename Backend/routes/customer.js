import express from 'express';
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
} from '../controller/customerController.js';

const router = express.Router();

router.route('/')
  .post(createCustomer)
  .get(getCustomers);

router.route('/:id')
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;