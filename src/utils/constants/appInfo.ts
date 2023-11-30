import { convertContractAddress } from '@src/utils/helpers/convertContractAddress'

export const SMART_CONTRACT_ID_DECIMAL = import.meta.env
  .VITE_HEDERA_SMART_CONTRACT_ID as string

export const SMART_CONTRACT_ID_HEXADECIMAL = convertContractAddress(
  SMART_CONTRACT_ID_DECIMAL
)

export const HEDERA_NETWORK = import.meta.env.VITE_HEDERA_NETWORK as
  | 'testnet'
  | 'mainnet'
  | 'previewnet'

export const WALLET_CONFIG_NAME = import.meta.env
  .VITE_WALLET_CONFIG_NAME as string

export const WALLET_CONFIG_DESCRIPTION = import.meta.env
  .VITE_WALLET_CONFIG_DESCRIPTION as string

export const WALLET_CONFIG_ICON_URL = import.meta.env
  .VITE_WALLET_CONFIG_ICON_URL as string

export const WALLET_CONFIG_APP_URL = import.meta.env
  .VITE_WALLET_CONFIG_APP_URL as string
