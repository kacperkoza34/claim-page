import clsx from 'clsx'
import { MouseEventHandler, ReactElement } from 'react'

interface ButtonProps {
  label?: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactElement
  disabled?: boolean;
  noBorder?: boolean;
  children?: React.ReactNode;
  size?: 'small' | 'normal'
  type?: 'button' | 'submit',
  transparent?: boolean,
}

export const Button: React.FC<ButtonProps> = ({
  label,
  className,
  onClick,
  icon,
  disabled,
  children,
  size,
  transparent,
  noBorder,
  type = 'button'
}) => {
  const buttonClassName = clsx(
    noBorder ? '' : 'border',
    transparent
      ? "bg-transparent border-secondary !text-secondary text-secondary"
      : "text-white",
    "focus:!outline focus:!outline-4 focus:!outline-secondary-100",
    disabled
      ? "bg-disabled !text-white hover:cursor-not-allowed border-disabled text-secondary"
      : "bg-secondary hover:bg-secondary-hover",
    "leading-[100%] group rounded transition-all duration-100 ease-in-out px-8 py-4",
    size === "small" && "px-1 py-[8px]"
  );

  return (
    <button
      disabled={disabled}
      className={clsx(buttonClassName, className ?? "")}
      onClick={onClick}
      type={type}
    >
      {icon && icon}
      {label && label}
      {children && children}
    </button>
  );
}
