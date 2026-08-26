import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from './icon-button.module.scss';

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
}

export function IconButton({
  children,
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}