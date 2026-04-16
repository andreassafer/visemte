import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'text-white disabled:opacity-60',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  ghost:
    'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'p-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={isPrimary ? {
        backgroundColor: 'var(--accent)',
        // @ts-expect-error CSS custom properties
        '--tw-ring-color': 'var(--accent-ring)',
      } : undefined}
      onMouseEnter={isPrimary ? (e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)' } : undefined}
      onMouseLeave={isPrimary ? (e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent)' } : undefined}
      {...props}
    >
      {children}
    </button>
  )
}
