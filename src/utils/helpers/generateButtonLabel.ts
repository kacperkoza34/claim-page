export const generateButtonLabel = (
  label: string,
  connectionType: string,
  disabled: boolean | undefined,
  connectedWalletType: string | undefined
) => {
  if (disabled) return `${label} (Coming soon)`
  const actionWord =
    connectedWalletType === connectionType ? 'Disconnect from' : 'Connect to'
  return `${actionWord} ${label}`
}
