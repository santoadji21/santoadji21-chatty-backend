import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { signinSchema } from '@auth/schemas/signin'
import { zodValidation } from '@globals/decoratos/zod-validation.decorator'
import { BadRequestError } from '@globals/helpers/error-handler'
import { config } from '@root/config'
import { authService } from '@services/db/auth.services'
import { userService } from '@services/db/user.services'
import { IUserDocument } from '@user/interfaces/user.interface'
import { Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import JWT from 'jsonwebtoken'

import { Session } from 'express-session'

interface CustomSession extends Session {
  jwt?: string
}
export class SigIn {
  @zodValidation(signinSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username)

    // console.log('isUserExists:', existingUser)

    if (!existingUser) {
      throw new BadRequestError('User not found')
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password)
    if (!passwordsMatch) {
      throw new BadRequestError('Password is incorrect')
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`)
    console.log('user:', user)
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_SECRET!
    )
    ;(req.session as CustomSession).jwt = userJwt
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', token: userJwt, user: existingUser })
  }
}
