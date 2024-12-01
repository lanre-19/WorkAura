import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
    className?: string;
    dotSize?: string;
    gapSize?: string;
    color?: string;
    height?: string;
    direction?: "horizontal" | "vertical";
}

const DottedSeparator = ({
    className,
    dotSize = "2px",
    gapSize = "6px",
    color = "#d4d4d8",
    height = "2px",
    direction = "horizontal"
}: DottedSeparatorProps) => {
    const isHorizontal = direction === "horizontal";

    return (
        <div
          className={cn(
            isHorizontal ? "flex items-center w-full" : "flex flex-col h-full items-center",
            className
          )}
        >
            <div
              className={isHorizontal ? "flex-grow" : "flex-grow-0"}
              style={{
                width: isHorizontal ? "100%" : height,
                height: isHorizontal ? height : "100%",
                backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
                backgroundSize: isHorizontal ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}` : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
                backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
                backgroundPosition: "center"
              }}
            />
        </div>
    );
}
 
export default DottedSeparator;