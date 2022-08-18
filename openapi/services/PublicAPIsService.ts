import { Service } from 'ikigai-digital-nrs-api-server'

/**
 * Return the locality's configuration
 *
 * localityId BigDecimal
 * returns getLocalityConfig_200_response
 * */
export const getLocalityConfig = ({ localityId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          localityId,
        }),
      )
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405))
    }
  })
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
        Service.successResponse({
          user,
        }),
      )
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405))
    }
  })
