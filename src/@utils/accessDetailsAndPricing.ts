import { gql, OperationResult } from 'urql'
import { Asset, LoggerInstance, ProviderInstance } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'
import { calcInGivenOut } from './pool'
import { AccessDetails, OrderPriceAndFees } from 'src/@types/Price'
import Decimal from 'decimal.js'
import { consumeMarketOrderFee } from '../../app.config'

const tokensPriceQuery = gql`
  query TokensPriceQuery($datatokenIds: [ID!], $account: String) {
    tokens(where: { id_in: $datatokenIds }) {
      id
      symbol
      name
      publishMarketFeeAddress
      publishMarketFeeToken
      publishMarketFeeAmount
      orders(
        where: { consumer: $account }
        orderBy: createdTimestamp
        orderDirection: desc
      ) {
        tx
        serviceIndex
        createdTimestamp
      }
      dispensers {
        id
        active
        isMinter
        maxBalance
        token {
          id
          name
          symbol
        }
      }
      fixedRateExchanges {
        id
        exchangeId
        price
        publishMarketSwapFee
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
        active
      }
      pools {
        id
        spotPrice
        isFinalized
        datatokenLiquidity
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
      }
    }
  }
`
const tokenPriceQuery = gql`
  query TokenPriceQuery($datatokenId: ID!, $account: String) {
    token(id: $datatokenId) {
      id
      symbol
      name
      publishMarketFeeAddress
      publishMarketFeeToken
      publishMarketFeeAmount
      orders(
        where: { consumer: $account }
        orderBy: createdTimestamp
        orderDirection: desc
      ) {
        tx
        serviceIndex
        createdTimestamp
      }
      dispensers {
        id
        active
        isMinter
        maxBalance
        token {
          id
          name
          symbol
        }
      }
      fixedRateExchanges {
        id
        exchangeId
        price
        publishMarketSwapFee
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
        active
      }
      pools {
        id
        spotPrice
        isFinalized
        datatokenLiquidity
        baseToken {
          symbol
          name
          address
        }
        datatoken {
          symbol
          name
          address
        }
      }
    }
  }
`

/**
 * This will be used to get price including feed before ordering
 * @param {AssetExtended} asset
 * @return {Promise<OrdePriceAndFee>}
 */
export async function getOrderPriceAndFees(
  asset: AssetExtended,
  accountId: string,
  paramsForPool: CalcInGivenOutParams
): Promise<OrderPriceAndFees> {
  const orderPriceAndFee = {
    price: '0',
    publisherMarketOrderFee:
      asset?.accessDetails?.publisherMarketOrderFee || '0',
    publisherMarketPoolSwapFee: '0',
    publisherMarketFixedSwapFee: '0',
    consumeMarketOrderFee: consumeMarketOrderFee || '0',
    consumeMarketPoolSwapFee: '0',
    consumeMarketFixedSwapFee: '0',
    providerFee: {
      providerFeeAmount: '0'
    },
    opcFee: '0'
  } as OrderPriceAndFees

  // fetch provider fee
  const initializeData = await ProviderInstance.initialize(
    asset?.id,
    asset.services[0].id,
    0,
    accountId,
    asset?.services[0].serviceEndpoint
  )
  orderPriceAndFee.providerFee = initializeData.providerFee

  // fetch price and swap fees
  switch (asset?.accessDetails?.type) {
    case 'dynamic': {
      const poolPrice = calcInGivenOut(paramsForPool)
      orderPriceAndFee.price = poolPrice.tokenAmount
      orderPriceAndFee.liquidityProviderSwapFee =
        poolPrice.liquidityProviderSwapFeeAmount
      orderPriceAndFee.publisherMarketPoolSwapFee =
        poolPrice.publishMarketSwapFeeAmount
      orderPriceAndFee.consumeMarketPoolSwapFee =
        poolPrice.consumeMarketSwapFeeAmount
      break
    }
  }

  // calculate full price, we assume that all the values are in ocean, otherwise this will be incorrect
  orderPriceAndFee.price = new Decimal(orderPriceAndFee.price)
    .add(new Decimal(orderPriceAndFee.consumeMarketOrderFee))
    .add(new Decimal(orderPriceAndFee.publisherMarketOrderFee))
    .add(new Decimal(orderPriceAndFee.providerFee.providerFeeAmount))
    .toString()
  return orderPriceAndFee
}
