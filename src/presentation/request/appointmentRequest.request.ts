import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
@injectable()
class AppointmentRequestValidator {
  createAppointmentRequestSchema() {
    const schema = Joi.object({
      description: Joi.string().min(6).optional().messages({
        "string.empty": "description must not be empty.",
        "string.min":
          "description should have a minimum length of 6 characters.",
      }),
    });

    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  }
}

export default AppointmentRequestValidator;
