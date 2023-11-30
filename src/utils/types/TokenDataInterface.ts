import BigNumber from 'bignumber.js'

export interface TokenDataInterface {
  symbol: string
  decimals: string
  price?: BigNumber
  name?: string
  token_id?: string
  max_supply?: string
}
