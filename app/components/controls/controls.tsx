"use client"

import { ArrowLeftRight, Lock, RefreshCcw, Unlock } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

import { useAsciiProvider } from "@/context/AsciiProvider";
import {
  ASCII_CHAR_PRESETS,
  ASCII_CONSTRAINTS,
  DEFAULT_ASCII_CONFIG,
} from "@/lib/ascii";
import { cn } from "@/lib/utils";
import { ColourInput } from "../../components/controls/controls-colour-input";
import { ControlsHeadingLabel } from "../../components/controls/controls-heading-label";
import { DisplayToggle } from "../../components/display/display-toggle";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SidebarSeparator } from "../../components/ui/sidebar";
import { Slider } from "../../components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useAccount, useDisconnect } from "wagmi";
import { Card, CardHeader } from "../ui/card";
import { truncateAddress } from "@/lib/truncateAddress";

export function Controls() {
  const { config, updateConfig } = useAsciiProvider();
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(
    config.outputWidth / config.outputHeight,
  );
  const [isInverted, setIsInverted] = useState(false);

  // wagmi
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect()

  function handleWidthChange(width: number) {
    if (isAspectRatioLocked) {
      const newHeight = Math.round(width / aspectRatio);
      const height = Math.min(
        Math.max(newHeight, ASCII_CONSTRAINTS.OUTPUT_HEIGHT.MIN),
        ASCII_CONSTRAINTS.OUTPUT_HEIGHT.MAX,
      );
      updateConfig({
        outputWidth: width,
        outputHeight: height,
      });
    } else {
      updateConfig({ outputWidth: width });
      setAspectRatio(width / config.outputHeight);
    }
  }

  function handleHeightChange(height: number) {
    if (isAspectRatioLocked) {
      const newWidth = Math.round(height * aspectRatio);
      const width = Math.min(
        Math.max(newWidth, ASCII_CONSTRAINTS.OUTPUT_WIDTH.MIN),
        ASCII_CONSTRAINTS.OUTPUT_WIDTH.MAX,
      );
      updateConfig({
        outputHeight: height,
        outputWidth: width,
      });
    } else {
      updateConfig({ outputHeight: height });
      setAspectRatio(config.outputWidth / height);
    }
  }

  return (
    <div className="flex flex-col gap-2">

      <div className="sm:hidden">
        <DisplayToggle />
        <SidebarSeparator className="-ml-2 -mr-2 mt-2" />
      </div>

      {/* User */}
      {isConnected &&
        <Card>
          <CardHeader className="flex space-x-3 justify-between items-center">
            <div className="flex flex-row justify-center items-center space-x-3">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={"/icon.jpg"}
                  alt={"anon"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-start">
                <h2 className="text-lg font-bold">anon</h2>
                <p className="text-foreground/60">{truncateAddress(address as `0x${string}`)}</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    updateConfig(DEFAULT_ASCII_CONFIG);
                    setAspectRatio(
                      DEFAULT_ASCII_CONFIG.outputWidth /
                      DEFAULT_ASCII_CONFIG.outputHeight,
                    );
                  }}
                  className="size-6 m-auto bg-[#333] rounded-full p-4 text-muted-foreground"
                >
                  <RefreshCcw className="!size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>reset</TooltipContent>
            </Tooltip>
          </CardHeader>
          <Button
            variant="secondary"
            onClick={() => disconnect()}
            className="w-full rounded-none text-white bg-pink-900 hover:bg-pink-950"
          >
            signout
          </Button>
        </Card>
      }

      <div className="flex flex-col gap-2">
        <div className="mb-1 flex items-center gap-2">
          <ControlsHeadingLabel>resolution</ControlsHeadingLabel>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAspectRatioLocked(!isAspectRatioLocked)}
                className="size-6 text-muted-foreground"
              >
                {isAspectRatioLocked ? (
                  <Lock className="!size-3.5" />
                ) : (
                  <Unlock className="!size-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isAspectRatioLocked ? "unlock ratio" : "lock ratio"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col">
          <ControlLabel>width (characters)</ControlLabel>
          <ControlsNumberSlider
            value={config.outputWidth}
            onValueChange={handleWidthChange}
            min={ASCII_CONSTRAINTS.OUTPUT_WIDTH.MIN}
            max={ASCII_CONSTRAINTS.OUTPUT_WIDTH.MAX}
          />
        </div>

        <div className="flex flex-col">
          <ControlLabel>height (characters)</ControlLabel>
          <ControlsNumberSlider
            value={config.outputHeight}
            onValueChange={handleHeightChange}
            min={ASCII_CONSTRAINTS.OUTPUT_HEIGHT.MIN}
            max={ASCII_CONSTRAINTS.OUTPUT_HEIGHT.MAX}
          />
        </div>
      </div>

      <SidebarSeparator className="-ml-2 -mr-2" />

      <div className="flex flex-col gap-2">
        <ControlsHeadingLabel className="mb-1">font</ControlsHeadingLabel>

        <div className="-mt-0.5 flex flex-col gap-1.5">
          <ControlLabel>colour</ControlLabel>
          <ColourInput
            colour={config.colour}
            onChange={(colour) => updateConfig({ colour })}
          />
        </div>

        <div className="flex flex-col">
          <ControlLabel>size (px)</ControlLabel>
          <ControlsNumberSlider
            value={config.fontSize}
            onValueChange={(fontSize) => updateConfig({ fontSize })}
            min={ASCII_CONSTRAINTS.FONT_SIZE.MIN}
            max={ASCII_CONSTRAINTS.FONT_SIZE.MAX}
          />
        </div>
      </div>

      <SidebarSeparator className="-ml-2 -mr-2" />

      <div className="flex flex-col gap-2">
        <ControlsHeadingLabel className="mb-1">characters</ControlsHeadingLabel>

        <div className="flex flex-col gap-1.5">
          <ControlLabel>preset</ControlLabel>
          <Select
            value={
              ASCII_CHAR_PRESETS.includes(config.chars) ? config.chars : ""
            }
            onValueChange={(value) => updateConfig({ chars: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="select preset" />
            </SelectTrigger>
            <SelectContent>
              {ASCII_CHAR_PRESETS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <ControlLabel>custom</ControlLabel>
          <div className="relative flex items-center">
            <Input
              value={config.chars}
              onChange={(e) => updateConfig({ chars: e.target.value })}
              placeholder="enter characters..."
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsInverted(!isInverted);
                updateConfig({
                  chars: config.chars.split("").reverse().join(""),
                });
              }}
              className="absolute right-1.5 size-6 text-muted-foreground"
            >
              <ArrowLeftRight
                className={cn("!size-3.5", { "-scale-x-100": isInverted })}
              />
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}

type ControlLabelProps = React.ComponentProps<typeof Label>;
function ControlLabel(props: ControlLabelProps) {
  return <Label className="text-xs" {...props} />;
}

interface ControlsNumberSliderProps
  extends Omit<React.ComponentProps<typeof Slider>, "value" | "onValueChange"> {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
}
function ControlsNumberSlider({
  className,
  value,
  onValueChange,
  min,
  max,
  ...props
}: ControlsNumberSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <Slider
        value={[value]}
        onValueChange={([value]) => onValueChange(value)}
        min={min}
        max={max}
        step={1}
        className={cn("flex-1", className)}
        {...props}
      />
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const parsed = parseInt(e.target.value);
          if (!isNaN(parsed)) {
            const clamped = Math.min(Math.max(parsed, min), max);
            onValueChange(clamped);
          }
        }}
        className="w-20"
      />
    </div>
  );
}
