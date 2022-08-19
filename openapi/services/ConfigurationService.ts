import { BaseService } from '../generated/provider/nrs/nrsApi/1.0.3'

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
        BaseService.successResponse({
          localityId,
        }),
      )
    } catch (e) {
      reject(BaseService.rejectResponse(e.message || 'Invalid input', e.status || 405))
    }
  })
