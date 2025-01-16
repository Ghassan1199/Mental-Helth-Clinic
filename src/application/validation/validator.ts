import { injectable } from "tsyringe";
import StatusError from "../utils/error";
@injectable()
class Validator {
	public validateUpdateProfile(updatedData: any, file: any) {
		const { phone, photo, dateOfBirth, fullName, gender } = updatedData;

		if (!phone && !photo && !dateOfBirth && !fullName && !gender && !file) {
			throw new StatusError(400, "Update something");
		}
	}

	public isValidEmail(email: string): boolean {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	public isValidPassword(password: string): boolean {
		const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
		return regex.test(password);
	}

	public isValidPhoneNumber(phoneNumber: string): boolean {
		const regex = /^09\d{8}$/;

		return regex.test(phoneNumber);
	}
	public isValidDate(date: string): boolean {
		return new Date().getFullYear() - new Date(date).getFullYear() >= 18;
	}

  public registerValidator(input: any, file: any): void {
    const { email, password, roleId, dateOfBirth, gender, phone, fullName , deviceToken} =
      input;

    this.validateRequiredFields({
      email,
      password,
      roleId,
      dateOfBirth,
      gender,
      phone,
      fullName,
      file,
      deviceToken
    });

		if (!this.isValidEmail(email)) {
			throw new StatusError(400, "Invalid Email Format.");
		}

		if (!this.isValidPassword(password)) {
			throw new StatusError(400, "Invalid Password Format.");
		}

		if (!this.isValidDate(dateOfBirth)) {
			throw new StatusError(400, "Enter a valid date");
		}

		if (!this.isValidPhoneNumber(phone)) {
			throw new StatusError(400, "Invalid phone number.");
		}

		if (!this.isValidUserName(fullName)) {
			throw new StatusError(400, "Invalid User Name Format.");
		}
	}

	public loginValidator(
		email: any,
		password: any,
		deviceToken: any
	): void {
		this.validateRequiredFields({ email, password, deviceToken });
		if (!this.isValidEmail(email)) {
			throw new StatusError(400, "Invalid Email Format.");
		}

		if (!this.isValidPassword(password)) {
			throw new StatusError(400, "Invalid Password Format.");
		}
	}

	public isValidUserName(user_name: string): boolean {
		const regex = /^[a-zA-Z]{2,}(?: [a-zA-Z]{2,})$/;
		return regex.test(user_name);
	}

	public validateRequiredFields(fields: Record<string, any>): void {
		for (const key in fields) {
			if (!fields[key]) {
				throw new StatusError(400, `${key.toUpperCase()} is required.`);
			}
		}
	}
}

export default Validator;