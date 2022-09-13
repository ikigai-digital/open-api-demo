import { BaseController } from '../generated/provider/cards/cardsPostingApi/1.0.0'

import { debitAccount as debitAccountService } from '../services/AccountDebitsService'

export const debitAccount = async (request, response) => {
  await BaseController.handleRequest(request, response, debitAccountService)
}
