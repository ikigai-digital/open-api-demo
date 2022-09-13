import { BaseController } from '../generated/provider/cards/cardsPostingApi/1.0.0'

import { balanceAccount as balanceAccountService } from '../services/BalanceInquiryService'

export const balanceAccount = async (request, response) => {
  await BaseController.handleRequest(request, response, balanceAccountService)
}
