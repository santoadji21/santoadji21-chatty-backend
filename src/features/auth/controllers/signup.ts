import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface'
import { signupSchema } from '@auth/schemas/signup'
import { validation } from '@globals/decoratos/zod-validation.decorator'
import { uploads } from '@globals/helpers/cloudinary-upload'
import { BadRequestError } from '@globals/helpers/error-handler'
import { Helpers } from '@globals/helpers/helper'
import { authService } from '@services/db/auth.services'
import { UploadApiResponse } from 'cloudinary'
import { Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'

export class SignUp {
  @validation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body
    const isUserExists: IAuthDocument = await authService.getUserByUsernameorEmail(username, email)

    if (isUserExists) {
      throw new BadRequestError(`User with username ${isUserExists.username} or email ${isUserExists.email} already exists`)
    }

    const authObjectId: ObjectId = new ObjectId()
    const userObjectId: ObjectId = new ObjectId()
    const uId = `${Helpers.generateRandomInteger(12)}`
    const authData: IAuthDocument = SignUp.prototype.signUpData({
      _id: authObjectId,
      uId,
      email,
      username,
      password,
      avatarColor,
    })
    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse

    if (!result?.public_id) {
      throw new BadRequestError('Something went wrong while uploading your avatar image')
    }

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      data: authData,
    })
  }

  private signUpData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, password, avatarColor, uId } = data
    return {
      _id,
      uId,
      password,
      avatarColor,
      email: email.toLowerCase(),
      username: Helpers.firstLetterUpperCase(username),
      createdAt: new Date(),
    } as IAuthDocument
  }
}
