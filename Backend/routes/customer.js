import express from 'express';
import { 
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById
} from '../controller/customerController.js';

const router = express.Router();

router.route('/')
  .post(createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

export default router;