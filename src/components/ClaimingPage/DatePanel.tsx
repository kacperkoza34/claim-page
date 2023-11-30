import { TooltipIcon } from '@src/assets/icons/TooltipIcon'
import { Tooltip } from '@src/components/shared/Tooltip'
import { dateTooltipText } from '@src/utils/constants/tooltipText'
import { useClaimingPageContext } from '@src/utils/hooks/useClaimingPageContext'

export const DatePanel: React.FC = () => {
  const {
    claimCounter: {
      startDate,
      endDate,
      timeToDistributionEnd,
      timeToDistributionStart,
      claimingStatus,
    },
  } = useClaimingPageContext();

  const displayCounter = () => {
    if(claimingStatus === 'countToStart') {
      return <>
        <p className='text-[12px] mb-1.5'>Claiming starts in</p>
        <h3>{timeToDistributionStart}</h3>
      </>
    }

    if(claimingStatus === 'countToEnd') {
      return <>
        <p className='text-[12px] mb-1.5'>Claiming ends in</p>
        <h3>{timeToDistributionEnd}</h3>
      </>
    }

    if(claimingStatus === 'expired') {
      return <>
        <p className='text-[12px] mb-1.5'>Claiming status</p>
        <h3>Expired</h3>
      </>
    }

    if(claimingStatus === 'noLimits') {
      return <>
        <p className='text-[12px] mb-1.5'>Claiming status</p>
        <h3>Active</h3>
      </>
    }
  }

  return (
    <>
      <div className='w-[222px]'>
        <div className='flex mb-1.5 items-center gap-1'>
          <p className='text-[12px]'>Start/End Date</p>
          <Tooltip tooltip={dateTooltipText}>
            <TooltipIcon />
          </Tooltip>
        </div>
        <div className='flex justify-between'>
          <div>
            <h4 className='text-black mb-1.5'>Start</h4>
            <h4 className='text-black'>End</h4>
          </div>
          <div>
            <p className='mb-1.5'>{startDate || '-'}</p>
            <p>{endDate || '-'}</p>
          </div>
        </div>
      </div>
      <div>
        {displayCounter()}
      </div>
    </>
  )
}
