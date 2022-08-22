import { BaseController } from '../generated/provider/nrs/nrsApi/2.0.0'

import { getUserPreferredLanguage as getUserPreferredLanguageService } from '../services/PreferredLangService'

export const getUserPreferredLanguage = async (request, response) => {
  console.log('V2 Controller')

  await BaseController.handleRequest(request, response, getUserPreferredLanguageService)
}
