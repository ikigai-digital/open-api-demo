import { BaseController } from '../generated/provider/nrs/nrsApi/2.0.0'

import { getLocalityConfig as getLocalityConfigService } from '../services/ConfigurationService'

export const getLocalityConfig = async (request, response) => {
  await BaseController.handleRequest(request, response, getLocalityConfigService)
}
