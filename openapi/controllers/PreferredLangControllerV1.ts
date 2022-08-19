import { BaseController } from '../generated/provider/nrs/nrsApi/1.0.2'

import { getUserPreferredLanguage as getUserPreferredLanguageService } from '../services/PreferredLangService'

export const getUserPreferredLanguage = async (request, response) => {
  await BaseController.handleRequest(request, response, getUserPreferredLanguageService)
}
