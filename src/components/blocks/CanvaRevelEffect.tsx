import { cn } from "@/lib/utils";
import { DotMatrix } from "./DotMatrix";

export const CanvasRevealEffect = ({
    animationSpeed = 10,
    opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
    colors = [[0, 255, 255]],
    containerClassName,
    dotSize,
    showGradient = true,
    reverse = false, // This controls the direction
  }: {
    animationSpeed?: number;
    opacities?: number[];
    colors?: number[][];
    containerClassName?: string;
    dotSize?: number;
    showGradient?: boolean;
    reverse?: boolean; // This prop determines the direction
  }) => {
    return (
      <div className={cn("h-full relative w-full", containerClassName)}> {/* Removed bg-white */}
        <div className="h-full w-full">
          <DotMatrix
            colors={colors ?? [[0, 255, 255]]}
            dotSize={dotSize ?? 3}
            opacities={
              opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
            }
            // Pass reverse state and speed via string flags in the empty shader prop
            shader={`
              ${reverse ? 'u_reverse_active' : 'false'}_;
              animation_speed_factor_${animationSpeed.toFixed(1)}_;
            `}
            center={["x", "y"]}
          />
        </div>
        {showGradient && (
          // Adjust gradient colors if needed based on background (was bg-white, now likely uses containerClassName bg)
          // Example assuming a dark background like the SignInPage uses:
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        )}
      </div>
    );
  };
  