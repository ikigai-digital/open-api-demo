import { BaseService } from '../generated/provider/nrs/nrsApi/1.0.3'

/**
 * Return the user's preferred language
 *
 * user String
 * returns preferredLang
 * */
export const getUserPreferredLanguage = ({ user }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        BaseService.successResponse({
          user,
        }),
      )
    } catch (e) {
      reject(BaseService.rejectResponse(e.message || 'Invalid input', e.status || 405))
    }
  })
