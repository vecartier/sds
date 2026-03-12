import clsx from "clsx";

export type IconSize = "12" | "16" | "24" | "32";
export type IconProps = {
  children?: React.ReactNode;
  className?: string;
  size?: IconSize;
  viewBox?: string;
};
export function Icon({ size = "24", children, className, viewBox = "0 0 24 24" }: IconProps) {
  return (
    <svg
      className={clsx(className, "icon", `icon-size-${size}`)}
      viewBox={viewBox}
      fill="var(--svg-fill-color)"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
