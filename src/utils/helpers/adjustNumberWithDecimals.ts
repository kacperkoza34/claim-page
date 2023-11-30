import BigNumber from 'bignumber.js'

export const adjustNumberWithDecimals = (number, decimals) => {
  const decimalsCount = parseInt(decimals, 10)
  let bigNumber = new BigNumber(number)
  bigNumber = bigNumber.shiftedBy(-decimalsCount)

  return bigNumber
}
