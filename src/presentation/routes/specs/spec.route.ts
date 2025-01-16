import { SpecialistController } from "../../controllers/specs/Specialist.Controller";
import UploadHandler from "../../middlewares/handlers/upload.handler";
import { SpecialistProfileController } from "../../controllers/specs/SpecialistProfile.Controller";
import { RegistrationController } from "../../controllers/registration/Registration.Controller";
import { MedicalRecordController } from "../../controllers/medical-record/MedicalRecord.Controller";
import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { container } from "tsyringe";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const specialistProfileController = container.resolve(
  SpecialistProfileController,
);
const specialistController = container.resolve(SpecialistController);
const medicalRecordController = container.resolve(MedicalRecordController);
const registrationController = container.resolve(RegistrationController);
const uploadHandler = container.resolve(UploadHandler);

/************************ routes ***************************/
router.post(
  "/register",
  uploadHandler.handleFileUpload,
  specialistController.register.bind(specialistController),
);

router.post("/login", specialistController.login.bind(specialistController));

router.post(
  "/password/reset",
  userAuth.checkUser,
  specialistController.resetPassword.bind(specialistController),
);

router.post(
  "/password/forgot",
  specialistController.forgotPassword.bind(specialistController),
);
router.get(
  "/profile",
  userAuth.checkUser,
  specialistProfileController.getSpecProfile.bind(specialistProfileController),
);
router.post(
  "/profile/edit",
  userAuth.checkUser,
  uploadHandler.handleFileUpload,
  specialistProfileController.editProfile.bind(specialistProfileController),
);
router.get(
  "/status",
  userAuth.checkUser,
  specialistProfileController.getSpecStatus.bind(specialistProfileController),
);
router.delete(
  "/delete",
  userAuth.checkUser,
  specialistController.remove.bind(specialistController),
);

router.get("/refresh", userAuth.generateRT);

router.post(
  "/clinicRegistrationRequest",
  userAuth.checkUser,
  uploadHandler.handleFileUpload,
  specialistController.clinicRegistrationRequest.bind(specialistController),
);

router.get(
  "/getClinicRegistrationRequests",
  userAuth.checkUser,
  specialistController.getClinicRegistrationRequest.bind(specialistController),
);


router.get(
  "/getClinicRegistrationRequests/:requestId",
  userAuth.checkUser,
  registrationController.getRequest.bind(registrationController),
);

router.get(
  "/checkEmail",
  specialistController.checkEmail.bind(specialistController),
);
router.post(
  "/employmentRequests/send",
  userAuth.checkUser,
  specialistController.sendAddEmployeeRequest.bind(specialistController),
);

router.get(
  "/employmentRequests",
  userAuth.checkUser,
  specialistController.getAllEmploymentRequests.bind(specialistController),
);

router.get(
  "/employmentRequests/sent",
  userAuth.checkUser,
  specialistController.getSentEmploymentRequestsByDoc.bind(
    specialistController,
  ),
);

router.get(
  "/employmentRequests/:requestId",
  userAuth.checkUser,
  specialistController.showEmploymentRequest.bind(specialistController),
);

router.put(
  "/employmentRequests/:requestId/approval",
  userAuth.checkUser,
  specialistController.handleEmploymentRequest.bind(specialistController),
);

router.delete(
  "/employmentRequests/:requestId/delete",
  userAuth.checkUser,
  specialistController.deleteEmploymentRequest.bind(specialistController),
);

router.get(
  "/search",
  userAuth.checkUser,
  specialistController.searchForSpecialists.bind(specialistController),
);

router.get(
  "/clinic/employees",
  userAuth.checkUser,
  specialistController.getEmployees.bind(specialistController),
);

router.delete(
  "/clinic/employees/:userId/remove",
  userAuth.checkUser,
  specialistController.removeEmployee.bind(specialistController),
);

router.delete(
  "/clinic/employees/:specialistId/leave",
  userAuth.checkUser,
  specialistController.leaveClinic.bind(specialistController),
);    
router.post(
  "/clinic/withdraw",
  userAuth.checkUser,
  specialistController.withdrawRequest.bind(specialistController),
);

router.get(
  "/clinic/withdraw",
  userAuth.checkUser,
  specialistController.getAllWithdrawRequests.bind(specialistController),
);

router.get(
  "/clinic/withdraw/:requestId",
  userAuth.checkUser,
  specialistController.showWithdrawRequest.bind(specialistController),
);
router.get(
  "/",
  userAuth.checkUser,
  specialistController.getAllSpecialists.bind(specialistController),
);

router.get(
  "/wallet/balance",
  userAuth.checkUser,
  specialistController.getMyBalance.bind(specialistController),
);

router.post(
  "/medicalRecords",
  userAuth.checkUser,
  medicalRecordController.createMedicalRecord.bind(medicalRecordController),
);

router.put(
  "/medicalRecords/update/:recordId",
  userAuth.checkUser,
  medicalRecordController.updateMedicalRecord.bind(medicalRecordController),
);
router.get(
  "/medicalRecords/getRecord/:recordId",
  userAuth.checkUser,
  medicalRecordController.getOneRecord.bind(medicalRecordController),
);

router.get(
  "/medicalRecords/:patientId",
  userAuth.checkUser,
  medicalRecordController.getMedicalRecords.bind(medicalRecordController),
);


router.get(
  "/patients",
  userAuth.checkUser,
  specialistController.getPatients.bind(specialistController),
);

router.get(
  "/patients/:userId/profile",
  userAuth.checkUser,
  specialistController.showPatientProfile.bind(specialistController),
);

router.post(
  "/assignment",
  userAuth.checkUser,
  specialistController.assign.bind(specialistController),
);

router.get(
  "/clinic/doctor",
  userAuth.checkUser,
  specialistController.getCliniForDoctor.bind(specialistController),
);

router.get(
  "/clinic/therapist",
  userAuth.checkUser,
  specialistController.getClinisForTherapist.bind(specialistController),
);


router.get(
  "/showProfile/:specId",
  userAuth.checkUser,
  specialistProfileController.getProfileForTherapistAndSpec.bind(specialistProfileController)
);


// WARNING: for testing only.
router.post(
  "/wallet/addMoneyForTesting",
  userAuth.checkUser,
  specialistController.addMoneyForTestingOnly.bind(specialistController),
);

router.get(
  "/getAllSpecialists",
  specialistController.getSpec.bind(specialistController)
);

router.get(
  "/roleId",
  userAuth.checkUser,   
  specialistProfileController.getRoleId.bind(specialistProfileController)
);


router.get(
  "/notifications",
  userAuth.checkUser,   
  specialistController.getNotifications.bind(specialistController)
);

export default router;
