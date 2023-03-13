import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
import { BadRequestError } from '@globals/helpers/error-handler'
import { Helpers } from '@globals/helpers/helper'

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data)
  }

  public async getUserByUsernameorEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUpperCase(username) }, { email: email.toLowerCase() }],
    }
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument
    return user
  }

  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    try {
      const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.firstLetterUpperCase(username) }).exec()) as IAuthDocument
      return user
    } catch (error) {
      throw new BadRequestError(`Error while finding user by username ${username}: ${error}`)
    }
  }
}

export const authService: AuthService = new AuthService()
