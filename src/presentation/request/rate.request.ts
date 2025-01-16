import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
@injectable()
class RateValidator {
  createRateSchema() {
    const schema = Joi.object({
      value: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Rate must be a valid integer.",
        "number.min": "Rate must be At least 1 .",
        "number.max": "Rate must be At most 5 .",
        "any.required": "Rate is required.",
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

export default RateValidator;
