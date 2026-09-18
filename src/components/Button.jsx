import React from 'react';
import clsx from 'clsx';

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
  ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className,
  children,
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const variantClass = variantClasses[variant] ?? variantClasses.primary;
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = clsx(
    baseClasses,
    variantClass,
    sizeClass,
    disabledClass,
    className
  );

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;