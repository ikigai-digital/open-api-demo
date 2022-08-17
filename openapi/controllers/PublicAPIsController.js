/**
 * The PublicAPIsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('../generated/provider/nrs/nrsApi/1.0.1/controllers/Controller')
const service = require('../services/PublicAPIsService')

const getLocalityConfig = async (request, response) => {
  await Controller.handleRequest(request, response, service.getLocalityConfig)
}

const getUserPreferredLanguage = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUserPreferredLanguage)
}

module.exports = {
  getLocalityConfig,
  getUserPreferredLanguage,
}
