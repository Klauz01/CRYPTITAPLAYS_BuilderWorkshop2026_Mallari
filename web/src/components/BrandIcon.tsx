import type { SimpleIcon } from 'simple-icons';

type BrandIconProps = {
  icon: SimpleIcon;
  size?: number;
  className?: string;
  decorative?: boolean;
};

export default function BrandIcon({
  icon,
  size = 24,
  className = '',
  decorative = false,
}: BrandIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={decorative ? undefined : icon.title}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
    >
      <path d={icon.path} />
    </svg>
  );
}
