import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
          className
        )
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "row-span-1 rounded-xl group/bento transition duration-200 shadow-input p-4 justify-between flex flex-col space-y-4",
          "glass-panel",
          className
        )
      )}
    >
      {children}
    </div>
  );
};
