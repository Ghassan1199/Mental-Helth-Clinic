import express from "express";
import appointmentRequestRoute from './appointmentRequest.route'; 
import appointmentRoute from './appointment.route'; 
import appointmentCancellationRoute from './appointmentCancellation.route'; 

const router = express.Router();
router.use('/', appointmentRoute);
router.use('/request', appointmentRequestRoute);
router.use('/cancellation', appointmentCancellationRoute);
export default router; 
