import clsx from 'clsx'

interface SeparatorProps {
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({ className }) => {
  const separatorClassName = clsx('w-full bg-hover h-[1px] my-4')

  return <div className={separatorClassName + ' ' + className} />
}
