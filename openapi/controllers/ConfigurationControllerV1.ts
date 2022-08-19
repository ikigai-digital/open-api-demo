import { BaseController } from '../generated/provider/nrs/nrsApi/1.0.3'

import { getLocalityConfig as getLocalityConfigService } from '../services/ConfigurationService'

export const getLocalityConfig = async (request, response) => {
  await BaseController.handleRequest(request, response, getLocalityConfigService)
}
