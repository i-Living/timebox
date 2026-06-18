import type { ComponentChildren } from 'preact';

interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md';
  block?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  children: ComponentChildren;
  style?: Record<string, string | number> | string;
  title?: string;
  type?: 'button' | 'submit';
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  disabled,
  onClick,
  children,
  style,
  title,
  type = 'button',
}: Props) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      class={classes}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style as any}
      title={title}
    >
      {children}
    </button>
  );
}
