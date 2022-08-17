/* eslint-disable no-unused-vars */
const Service = require('../generated/provider/nrs/nrsApi/1.0.1/services/Service.js')

/**
 * Return the locality's configuration
 *
 * localityId BigDecimal
 * returns getLocalityConfig_200_response
 * */
const getLocalityConfig = ({ localityId }) =>
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
const getUserPreferredLanguage = ({ user }) =>
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

module.exports = {
  getLocalityConfig,
  getUserPreferredLanguage,
}
