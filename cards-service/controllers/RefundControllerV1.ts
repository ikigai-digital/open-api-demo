import { BaseController } from '../generated/provider/cards/cardsPostingApi/1.0.0'

import { refundAccount as refundAccountService } from '../services/RefundService'

export const refundAccount = async (request, response) => {
  await BaseController.handleRequest(request, response, refundAccountService)
}
