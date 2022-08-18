import { Controller } from 'ikigai-digital-nrs-api-server'

import * as Services from '../services/PublicAPIsService'

export const getLocalityConfig = async (request, response) => {
  await Controller.handleRequest(request, response, Services.getLocalityConfig)
}

export const getUserPreferredLanguage = async (request, response) => {
  await Controller.handleRequest(request, response, Services.getUserPreferredLanguage)
}
