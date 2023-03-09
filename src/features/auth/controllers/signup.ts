import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface'
import { signupSchema } from '@auth/schemas/signup'
import { zodValidation } from '@globals/decoratos/zod-validation.decorator'
import { uploads } from '@globals/helpers/cloudinary-upload'
import { BadRequestError } from '@globals/helpers/error-handler'
import { Helpers } from '@globals/helpers/helper'
import { config } from '@root/config'
import { authService } from '@services/db/auth.services'
import { authQueue } from '@services/queues/auth.queue'
import { userQueue } from '@services/queues/user.queue'
import { UserCache } from '@services/redis/user-cache'
import { IUserDocument } from '@user/interfaces/user.interface'
import { UploadApiResponse } from 'cloudinary'
import { Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import JWT from 'jsonwebtoken'
import { omit } from 'lodash'
import { ObjectId } from 'mongodb'

const userCache: UserCache = new UserCache()

export class SignUp {
  @zodValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body
    const isUserExists: IAuthDocument = await authService.getUserByUsernameorEmail(username, email)

    if (isUserExists) {
      throw new BadRequestError(`User with username ${isUserExists.username} or email ${isUserExists.email} already exists`)
    }

    console.log('isUserExists:', isUserExists)

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

    // Check if avatar image is provided
    // const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse
    // if (!result?.public_id) {
    //   throw new BadRequestError('Something went wrong while uploading your avatar image')
    // }

    // Add to redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId)
    // userDataForCache.profilePicture = `https://res.cloudinary.com/dqjnvq4gv/image/upload/v${result.version}/${userObjectId}`
    // await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache)

    // Add to mongoDB
    // omit(userDataForCache, ['uId', 'username', 'email', 'password', 'avatarColor'])
    // authQueue.addAuthUserJob('addAuthUserToDB', { value: userDataForCache })
    userQueue.addUserJob('addUserToDB', { value: userDataForCache })

    const token: string = SignUp.prototype.signToken(authData, userObjectId)

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      token,
      user: userDataForCache,
      // user: {
      //   _id: authObjectId,
      //   uId,
      //   username: authData.username,
      //   email: authData.email,
      //   avatarColor: authData.avatarColor,
      //   avatarImage: result.secure_url,
      // },
    })
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor,
      },
      config.JWT_SECRET!
    )
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

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUpperCase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
    } as unknown as IUserDocument
  }
}
