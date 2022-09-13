import { BaseService } from '../generated/provider/cards/cardsPostingApi/1.0.0'
import { GetWalletsApi } from '../generated/client/wallet/getWalletsApi/1.0.0'

const getWalletsApi = new GetWalletsApi()

export const balanceAccount = (props) =>
  new Promise(async (resolve, reject) => {
    try {
      try {
        const res = await getWalletsApi.getWallets(1234)
        console.log({ res })
      } catch (error) {
        console.log({ error })
        console.log("API doesn't exist, continuing")
      }

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
