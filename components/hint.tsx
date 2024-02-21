import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
  children: React.ReactNode;
  desctription: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}

export const Hint = ({
  children,
  desctription,
  side = "bottom",
  sideOffset,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-sm max-w-[240px] break-words"
        >
          {desctription}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
