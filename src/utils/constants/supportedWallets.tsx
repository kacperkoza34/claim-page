import { HashPackWalletIcon } from '@src/assets/icons/HashPackWalletIcon'
import { BladeWalletIcon } from '@src/assets/icons/BladeWalletIcon'
import { ConnectionStateType } from '@src/utils/types/ConnectionStateType'

export const SUPPORTED_WALLETS = [
  {
    label: 'HashPack',
    icon: <HashPackWalletIcon />,
    connectionType: ConnectionStateType.HASHPACK,
    disabled: false,
  },
  {
    label: 'Blade',
    icon: <BladeWalletIcon />,
    connectionType: ConnectionStateType.BLADEWALLET,
    disabled: true,
  },
]
