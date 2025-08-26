import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: unknown;
}

export function Marquee({
  className,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] w-full",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "flex-row": !vertical,
              "flex-col": vertical,
            })}
            style={{
              animation: vertical 
                ? `marquee-vertical var(--duration) linear infinite`
                : `marquee var(--duration) linear infinite`
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
