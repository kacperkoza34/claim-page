import React from 'react'
import useHashPack from '@src/utils/hooks/wallets/useHashPack'
import useBladeWallet from '@src/utils/hooks/wallets/useBladeWallet'

interface HederaWalletsContextType {
  hashPack: ReturnType<typeof useHashPack>
  bladeWallet: ReturnType<typeof useBladeWallet>
}

const INITIAL_CONTEXT: HederaWalletsContextType = {
  hashPack: {
    hashConnectState: {},
    isIframeParent: false,
    connectToHashPack: () => undefined,
    disconnectFromHashPack: () => Promise.resolve(),
    sendTransactionWithHashPack: () => Promise.reject(),
  },
  bladeWallet: {
    activeBladeWalletAccountId: undefined,
    disconnectFromBladeWallet: () => Promise.resolve(),
    createBladeWalletSession: () => Promise.resolve(),
    sendTransactionWithBladeWallet: () => Promise.resolve(null),
  },
}

export const HederaWalletsContext = React.createContext(INITIAL_CONTEXT)

export default function HederaWalletsProvider({
  children,
}: {
  children: React.ReactElement
}) {
  const hashPack = useHashPack()
  const bladeWallet = useBladeWallet()

  return (
    <HederaWalletsContext.Provider
      value={{
        hashPack,
        bladeWallet,
      }}>
      {children}
    </HederaWalletsContext.Provider>
  )
}
