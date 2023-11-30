import React, { useState, useCallback, useEffect } from 'react'
import { HashConnect } from 'hashconnect'
import { HashConnectState } from './useHashPack'

export default function useHashConnectEvents(
  hashConnect: HashConnect,
  setHashConnectState: React.Dispatch<
    React.SetStateAction<Partial<HashConnectState>>
  >
) {
  const [isIframeParent, setIsIFrameParent] = useState(false)

  const updatePairingData = useCallback(
    (data) => {
      setHashConnectState((prev) => ({
        ...prev,
        pairingData: {
          ...prev.pairingData,
          ...data,
        },
      }))
    },
    [setHashConnectState]
  )

  const foundExtensionEventHandler = useCallback(
    (data) => {
      setHashConnectState((prev) => ({
        ...prev,
        availableExtension: data,
      }))
    },
    [setHashConnectState]
  )

  const pairingEventHandler = useCallback(
    (data) => {
      updatePairingData(data)
    },
    [updatePairingData]
  )

  const foundIframeEventHandler = useCallback(
    (data) => {
      updatePairingData(data)

      setIsIFrameParent(true)
    },
    [updatePairingData]
  )

  const mountEvents = useCallback(() => {
    if (hashConnect) {
      hashConnect.foundExtensionEvent.on(foundExtensionEventHandler)
      hashConnect.pairingEvent.on(pairingEventHandler)
      hashConnect.foundIframeEvent.on(foundIframeEventHandler)
    }
  }, [
    foundExtensionEventHandler,
    hashConnect,
    pairingEventHandler,
    foundIframeEventHandler,
  ])

  const unMountEvents = useCallback(() => {
    if (hashConnect) {
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler)
      hashConnect.pairingEvent.off(pairingEventHandler)
      hashConnect.foundIframeEvent.off(foundIframeEventHandler)
    }
  }, [
    foundExtensionEventHandler,
    hashConnect,
    pairingEventHandler,
    foundIframeEventHandler,
  ])

  useEffect(() => {
    mountEvents()

    return unMountEvents
  }, [mountEvents, unMountEvents])

  return {
    isIframeParent,
  }
}
