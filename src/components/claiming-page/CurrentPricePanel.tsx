import { TooltipIcon } from '@src/assets/icons/TooltipIcon'
import useContractState from '@src/utils/hooks/contract/useContractState'
import { Tooltip } from '@src/components/shared/Tooltip'
import { currentPriceTooltipText } from '@src/utils/constants/tooltipText'

export const CurrentPricePanel = () => {
  const { tokensPriceData } = useContractState()

  return (
    <>
      <div className='w-1/2'>
        <div className='flex mb-1.5 items-center gap-1'>
          <p className='text-[12px]'>Current Price</p>
          <Tooltip tooltip={currentPriceTooltipText}>
            <TooltipIcon />
          </Tooltip>
        </div>
        {tokensPriceData.length > 0 ? (
          tokensPriceData.map((token, index) => (
            <h4 className='mb-1.5' key={index}>
              {`${token.price?.toFixed()} ${token.symbol}`}
            </h4>
          ))
        ) : (
          <p>FREE</p>
        )}
      </div>
    </>
  )
}
