import { useCallback, useContext, useMemo, useEffect, useState } from 'react'
import { HederaWalletsContext } from '@src/utils/context/HederaWalletsContext'

export enum ConnectionStateType {
  BLADEWALLET = 'bladewallet',
  HASHPACK = 'hashpack',
  NOCONNECTION = 'noconnection',
}

const useHederaWallets = () => {
  const {
    hashPack: {
      disconnectFromHashPack,
      connectToHashPack,
      hashConnectState,
      sendTransactionWithHashPack,
      isIframeParent,
    },
    bladeWallet: {
      activeBladeWalletAccountId,
      disconnectFromBladeWallet,
      createBladeWalletSession,
      sendTransactionWithBladeWallet,
    },
  } = useContext(HederaWalletsContext)

  const [connectedWalletType, setConnectedWalletType] =
    useState<ConnectionStateType>(ConnectionStateType.NOCONNECTION)

  useEffect(() => {
    if (!activeBladeWalletAccountId && !hashConnectState.pairingData) {
      setConnectedWalletType(ConnectionStateType.NOCONNECTION)
    }
    if (activeBladeWalletAccountId && !hashConnectState.pairingData) {
      setConnectedWalletType(ConnectionStateType.BLADEWALLET)
    }
    if (
      hashConnectState.pairingData &&
      hashConnectState.pairingData.accountIds?.length > 0 &&
      !activeBladeWalletAccountId
    ) {
      setConnectedWalletType(ConnectionStateType.HASHPACK)
    }
  }, [
    activeBladeWalletAccountId,
    setConnectedWalletType,
    hashConnectState.pairingData,
  ])

  const connect = useCallback(
    async (walletType) => {
      try {
        switch (walletType) {
          case ConnectionStateType.BLADEWALLET: {
            await disconnectFromHashPack()
            await createBladeWalletSession()
            break
          }

          case ConnectionStateType.HASHPACK: {
            if (activeBladeWalletAccountId) {
              await disconnectFromBladeWallet()
            }

            connectToHashPack()

            break
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    [
      disconnectFromHashPack,
      createBladeWalletSession,
      activeBladeWalletAccountId,
      connectToHashPack,
      disconnectFromBladeWallet,
    ]
  )

  const disconnect = useCallback(() => {
    switch (connectedWalletType) {
      case ConnectionStateType.BLADEWALLET:
        disconnectFromBladeWallet()
        break
      case ConnectionStateType.HASHPACK:
        disconnectFromHashPack()
        break
      default:
        disconnectFromBladeWallet()
        disconnectFromHashPack()
        break
    }
  }, [connectedWalletType, disconnectFromBladeWallet, disconnectFromHashPack])

  const userWalletId = useMemo(() => {
    switch (connectedWalletType) {
      case ConnectionStateType.BLADEWALLET:
        return activeBladeWalletAccountId
      case ConnectionStateType.HASHPACK:
        return (
          hashConnectState.pairingData?.accountIds &&
          hashConnectState.pairingData?.accountIds[0]
        )
      case ConnectionStateType.NOCONNECTION:
        return undefined
    }
  }, [connectedWalletType, activeBladeWalletAccountId, hashConnectState])

  const sendTransaction = useCallback(
    async (tx) => {
      if (!userWalletId) {
        throw new Error('No connected Hedera account detected!.')
      }

      switch (connectedWalletType) {
        case ConnectionStateType.BLADEWALLET:
          return await sendTransactionWithBladeWallet(tx)

        case ConnectionStateType.HASHPACK:
          return await sendTransactionWithHashPack(tx)

        case ConnectionStateType.NOCONNECTION:
          throw new Error('No wallet connected!')
      }
    },
    [
      userWalletId,
      connectedWalletType,
      sendTransactionWithBladeWallet,
      sendTransactionWithHashPack,
    ]
  )

  const isWalletConnected = connectedWalletType !== 'noconnection'

  return {
    userWalletId,
    connectedWalletType,
    connect,
    disconnect,
    sendTransaction,
    isIframeParent,
    isWalletConnected,
  }
}

export default useHederaWallets
