import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { CategoryService } from "../../../application/services/category/Category.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class CategoryController {
  private categoryService: CategoryService;

  constructor(@inject(CategoryService) categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async addCategory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, eng } = req.body;

      await this.categoryService.createCategory(name, eng);

      res.status(201).json(successfulResponse("Category is added"));
    } catch (error: any) {
      next(error);
    }
  }

  async getCategories(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = this.categoryService.getCategories();

      res.status(200).json(successfulResponse("Categories", await categories));
    } catch (error: any) {
      next(error);
    }
  }
}
