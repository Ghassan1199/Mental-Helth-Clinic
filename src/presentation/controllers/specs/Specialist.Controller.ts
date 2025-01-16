import { Response, NextFunction } from "express";
import { SpecialistService } from "../../../application/services/specs/Specialist.Service";
import { successfulResponse } from "../../../application/utils/responseMessage";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { inject, injectable } from "tsyringe";
import UserProfileResource from "../../resources/UserProfileResource";
import { deleteFromCloudinary } from "../../middlewares/handlers/cloudinary.handler";
import { NotificationService } from "../../../application/services/Notification.Service";
import DoctorResource from "../../resources/DoctorResource";
@injectable()
export class SpecialistController {
  private specialistService: SpecialistService;
  private notificationService: NotificationService;


  constructor(@inject(SpecialistService) userService: SpecialistService, @inject(NotificationService) notificationService: NotificationService) {
    this.specialistService = userService;
    this.notificationService = notificationService;

  }

  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let spec;
    try {
      const file = req.files![0];
      spec = await this.specialistService.register(req.body, file);

      res.status(201).json(successfulResponse("User created successfully"));
    } catch (error: any) {

      if (spec) deleteFromCloudinary(spec.photo.match(/spec_photos\/(.*?)(?=\.[^.]*$)/)?.[0]);

      if (error.code === "ER_DUP_ENTRY") error.statusCode = 409;

      next(error);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await this.specialistService.login(req.body);

      res
        .status(200)
        .json(successfulResponse("User logged in successfully", data));
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { oldPassword, newPassword } = req.body;
      const specialist = req.auth!.user;

      await this.specialistService.resetPassword(
        specialist,
        oldPassword,
        newPassword
      );

      res
        .status(200)
        .json(successfulResponse("Password was reset successfully"));
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token, newPassword } = req.body;

      await this.specialistService.forgotPassword(newPassword, token);

      res
        .status(200)
        .json(successfulResponse("Password was reset successfully"));
    } catch (error: any) {
      next(error);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const specialist = req.auth!.user;

      await this.specialistService.remove(specialist);

      res.status(200).json(successfulResponse("User is deleted successfully"));
    } catch (error: any) {
      next(error);
    }
  }

  async clinicRegistrationRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const files = req.files!;
      const { latitude, longitude, clinicName, categories, address, cityId } =
        req.body;

      const categoryArray = categories.split(",");
      await this.specialistService.clinicRegistrationRequest(
        specialist,
        latitude,
        longitude,
        clinicName,
        categoryArray,  
        cityId,
        address,
        files   
      );

      res
        .status(200)
        .json(successfulResponse("Request is registered successfully"));
    } catch (error: any) {
      next(error);
    }
  }

  async countUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const spec = await this.specialistService.countUsers();

      res.status(200).json(successfulResponse("spec :", spec));
    } catch (error: any) {
      next(error);
    }
  }

  async getSpec(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const spec = await this.specialistService.getSpec();
      const count = await this.specialistService.countUsers();


      res.status(200).json(successfulResponse("spec :", [{spec:spec} , {count:count}]));
    } catch (error: any) {
      next(error);
    }
  }

  async getClinicRegistrationRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const requests = await this.specialistService.getMyRegistrationRequests(
        specialist
      );

      res
        .status(200)
        .json(successfulResponse("Registration Requests", requests!));
    } catch (error: any) {
      next(error);
    }
  }

  async checkEmail(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.body.email;
      const emailStatus = await this.specialistService.checkEmail(email);

      res.status(200).json(successfulResponse("Email Status", { emailStatus }));
    } catch (error: any) {
      next(error);
    }
  }

  async sendAddEmployeeRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const { userId } = req.body;

      await this.specialistService.sendAddEmployeeRequest(specialist, userId);

      res.status(200).json(successfulResponse(`A request is sent`));
    } catch (error: any) {
      next(error);
    }
  }

  async getAllEmploymentRequests(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const requests = await this.specialistService.getEmploymentRequests(
        specialist.id
      );

      res.status(200).json(successfulResponse(`Requests`, requests));
    } catch (error: any) {
      next(error);
    }
  }

  async getSentEmploymentRequestsByDoc(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const requests =
        await this.specialistService.getSentEmploymentRequestsByDoc(specialist);

      res.status(200).json(successfulResponse(`Requests`, requests));
    } catch (error: any) {
      next(error);
    }
  }

  async showEmploymentRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { requestId } = req.params;

      const request = await this.specialistService.showEmploymentRequest(
        Number(requestId)
      );

      res.status(200).json(successfulResponse(`Request`, request));
    } catch (error: any) {
      next(error);
    }
  }

  async handleEmploymentRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {   
      const { requestId } = req.params;
      const specialist = req.auth!.user;
      let status;
      if(req.body.status == "true"){
        status = true;
      }
      else{
        status = false;
      }
      await this.specialistService.handleEmploymentRequest(
        Number(requestId),
        status,
        specialist.id
      );

      res.status(200).json(successfulResponse(`Request has been handled.`));
    } catch (error: any) {
      next(error);
    }
  }

  async getEmployees(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const { userId } = req.query;

      const emps = await this.specialistService.getEmployees(
        specialist,
        userId
      );

      res.status(200).json(successfulResponse(`Employees`, emps));
    } catch (error: any) {
      next(error);
    }
  }

  async searchForSpecialists(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const name = req.query.name as string;
      const specialist = req.auth!.user;

      const emps = await this.specialistService.searchForSpecialist(
        name,
        specialist.id
      );

      res.status(200).json(successfulResponse(`Employees`, emps));
    } catch (error: any) {
      next(error);
    }
  }
  async withdrawRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const { amount } = req.body;

      await this.specialistService.withdrawRequest(specialist, amount);

      res
        .status(200)
        .json(successfulResponse("Withdraw request has been sent"));
    } catch (error: any) {
      next(error);
    }
  }

  async removeEmployee(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const { userId } = req.params;

      await this.specialistService.removeEmployee(
        specialist.id,
        Number(userId)
      );

      res.status(200).json(successfulResponse("Employee has been removed"));
    } catch (error: any) {
      next(error);
    }
  }

  async getAllSpecialists(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const specs = await this.specialistService.getAllSpecialists(
        specialist.id
      );

      res.status(200).json(successfulResponse(`Specialists`, specs));
    } catch (error: any) {
      next(error);
    }
  }

  async   getAllWithdrawRequests(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const requests = await this.specialistService.getAllwithdrawRequests(
        specialist.id
      );
      
      res.status(200).json(successfulResponse(`Withdraw Requests`, {requests}));
    } catch (error: any) {
      next(error);
    }
  }

  async showWithdrawRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { requestId } = req.params;

      const request = await this.specialistService.showWithdrawRequest(
        Number(requestId)
      );

      res.status(200).json(successfulResponse(`Withdraw Request`, request!));
    } catch (error: any) {
      next(error);
    }
  }

  async getMyBalance(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;

      const balance = await this.specialistService.getMyBalance(specialist);

      res.status(200).json(successfulResponse(`Balance`, balance!));
    } catch (error: any) {
      next(error);
    }
  }

  async addMoneyForTestingOnly(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const { amount } = req.body;

      await this.specialistService.addMoneyForTestingOnly(specialist, amount);

      res.status(200).json(successfulResponse(`Balance has been added`));
    } catch (error: any) {
      next(error);
    }
  }

  async deleteEmploymentRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { requestId } = req.params;

      await this.specialistService.deleteEmploymentRequest(
        req.auth!.user.id,
        Number(requestId)
      );

      res.status(200).json(successfulResponse("Request has been removed"));
    } catch (error: any) {
      next(error);
    }
  }
  async getPatients(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const spec = req.auth!.user;
      const patients = await this.specialistService.getPatients(spec);

      res.status(200).json(successfulResponse("Patients", patients));
    } catch (error: any) {
      next(error);
    }
  }

  async assign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const spec = req.auth!.user;
      const { specId, userId } = req.body;
      await this.specialistService.assign(spec, userId, specId);

      res
        .status(200)
        .json(successfulResponse("User has been assigned to therapist"));
    } catch (error: any) {
      next(error);
    }
  }


  async unassign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { specId, userId } = req.params;
      await this.specialistService.unassign(Number(userId), Number(specId));

      res
        .status(200)
        .json(successfulResponse("User has been unassigned from the therapist"));
    } catch (error: any) {
      next(error);
    }
  }


  async showPatientProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const profile = await this.specialistService.showPatientProfile(
        Number(userId)
      );

      res.status(200).json(successfulResponse("Profile", await new UserProfileResource().init(profile)));
    } catch (error: any) {
      next(error);
    }
  }



  async getClinisForTherapist(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {


      const spec = req.auth!.user;

      const clinics = await this.specialistService.getClinicsForTherapist(
        spec
      );

      res.status(200).json(successfulResponse("clinics", clinics));
    } catch (error: any) {
      next(error);
    }
  }


  async getCliniForDoctor(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {


      const spec = req.auth!.user;

      const clinic = await this.specialistService.getClinicForDoctor(
        spec
      );

      res.status(200).json(successfulResponse("clinic", clinic));
    } catch (error: any) {
      next(error);
    }
  }


  async leaveClinic(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.auth!.user;
      const { specialistId } = req.params;

      await this.specialistService.removeEmployee(
        Number(specialistId),
        user.id
      );

      res.status(200).json(successfulResponse("You have left the clinic."));
    } catch (error: any) {
      next(error);
    }
  }

  async getNotifications(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.auth!.user;

      const notifications = this.notificationService.getByUser(
        user
      );

      res.status(200).json(successfulResponse("Notifications.", await notifications));
    } catch (error: any) {
      next(error);
    }
  }

async getDocsBySpecialization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const specializationId = req.params.specializationId;
    const docs = await this.specialistService.getDocsBySpecialization(Number(specializationId));
    res.status(200).json(successfulResponse("Doctors",await new DoctorResource().init(docs)));
  } catch (error: any) {
    next(error);
  }   
}

}
