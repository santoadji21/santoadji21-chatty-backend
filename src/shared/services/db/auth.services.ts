import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
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
}

export const authService: AuthService = new AuthService()
