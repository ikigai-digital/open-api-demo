import { BaseService } from '../generated/provider/cards/cardsPostingApi/1.0.0'

export const reversalAccount = (props) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        BaseService.successResponse({
          ...props.body,
          responseCode: '12',
          transmissionDateTime: '12345',
        }),
      )
    } catch (e) {
      reject(BaseService.rejectResponse(e.message || 'Invalid input', e.status || 405))
    }
  })
