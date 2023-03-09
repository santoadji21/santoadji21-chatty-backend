import { IBasicInfo, INotificationSettings, ISocialLinks, IUserDocument } from '@user/interfaces/user.interface'
import { UserModel } from '@user/models/user.schema'

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data)
  }

  public async updateUserInfo(userId: string, info: IBasicInfo): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          work: info['work'],
          school: info['school'],
          quote: info['quote'],
          location: info['location'],
        },
      }
    ).exec()
  }

  public async updateSocialLinks(userId: string, links: ISocialLinks): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { social: links },
      }
    ).exec()
  }

  public async updateNotificationSettings(userId: string, settings: INotificationSettings): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { notifications: settings } }).exec()
  }
}

export const userService: UserService = new UserService()
