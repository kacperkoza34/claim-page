import clsx from 'clsx'
import { useRef } from 'react'

interface TooltipProps {
  children: React.ReactNode
  tooltip?: string,
  position?: 'top' | 'bottom'
}

export const Tooltip: React.FC<TooltipProps> = ({ children, tooltip, position = 'bottom' }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const container = useRef<HTMLDivElement>(null)

  const onMouseHandler = ({ clientX }: { clientX: number }) => {
    if (!tooltipRef.current || !container.current) return
    const { left } = container.current.getBoundingClientRect()
    tooltipRef.current.style.left = `${clientX - left}px`
  }

  const className = clsx(
    "absolute min-w-[150px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition bg-secondary text-textDefault text-[12px] px-2 py-1 rounded break-words",
    position === 'top' ? 'bottom-full -ml-4 mb-0.5' : 'top-full mt-2'
  );

  return (
    <div ref={container} onMouseEnter={onMouseHandler} className='group relative'>
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className={className}>
          {tooltip}
        </span>
      ) : null}
    </div>
  )
}
