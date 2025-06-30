import React from "react";

import { cn } from "@/lib/utils";
import { DisplayToggle } from "../../components/display/display-toggle";
import { SidebarTrigger } from "../../components/ui/sidebar";

type DisplayContainerProps = React.ComponentProps<"div">;
export function DisplayContainer({ children }: DisplayContainerProps) {
  return <div className="w-full min-h-screen">{children}</div>;
}

type DisplayActionsContainerProps = React.ComponentProps<"div">;
export function DisplayActionsContainer({
  children,
}: DisplayActionsContainerProps) {
  return (
    <div className="fixed top-0 bg-[#17101f] rounded-b-2xl z-20 w-full grid grid-cols-2 items-center gap-1 px-2 py-6 md:py-4 sm:grid-cols-[1fr,auto,1fr]">
      <div className="flex gap-2">{children}</div>
      <DisplayToggle className="hidden sm:block" />
      <SidebarTrigger className="place-self-end" />
    </div>
  );
}

type DisplayFooterContainerProps = React.ComponentProps<"div">;
export function DisplayFooterContainer({
  children,
}: DisplayFooterContainerProps) {
  return (
    <div className="fixed bottom-0 w-full px-2 py-1 bg-[#17101f] rounded-t-2xl z-20 ">
      {children}
    </div>
  );
}

type DisplayCanvasContainerProps = React.ComponentProps<"div">;
export function DisplayCanvasContainer({
  children,
}: DisplayCanvasContainerProps) {
  return (
    <div className="w-full overflow-hidden">
      {children}
    </div>
  );
}

type DisplayInsetProps = React.ComponentProps<"div">;
export function DisplayInset({
  children,
  className,
  ...props
}: DisplayInsetProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 grid place-items-center bg-[#3b2132]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type DisplayCanvasProps = React.ComponentProps<"canvas">;
// eslint-disable-next-line react/display-name
export const DisplayCanvas = React.forwardRef<
  HTMLCanvasElement,
  DisplayCanvasProps
>(({ className, ...props }, ref) => (
  <canvas
    className={cn("absolute inset-0 w-full h-full md:border-8 border-6 border-[#1e1825b5] rounded-2xl max-w-[384px] max-h-[384px] m-auto", className)}
    ref={ref}
    {...props}
  />
));
