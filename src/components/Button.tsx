/**
 * @fileoverview Reusable button component with variant, size, and block styling options.
 */

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

/**
 * Button component with configurable appearance and behavior.
 * @param {Props} props - Component properties
 * @param {string} [props.variant='primary'] - Visual style variant
 * @param {string} [props.size='md'] - Button size
 * @param {boolean} [props.block] - Whether button should take full width
 * @param {boolean} [props.disabled] - Whether button is disabled
 * @param {function} [props.onClick] - Click handler
 * @param {ComponentChildren} props.children - Button content
 * @param {Object|string} [props.style] - Additional CSS styles
 * @param {string} [props.title] - Tooltip text
 * @param {string} [props.type='button'] - Button type attribute
 */
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
  // Build class list from props, filtering out empty strings
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