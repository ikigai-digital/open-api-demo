import { BaseController } from '../generated/provider/cards/cardsPostingApi/1.0.0'

import { reversalAccount as reversalAccountService } from '../services/DebitReversalService'

export const reversalAccount = async (request, response) => {
  await BaseController.handleRequest(request, response, reversalAccountService)
}
