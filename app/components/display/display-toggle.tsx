import { Camera, Upload } from "lucide-react";

import { useAsciiProvider } from "@/context/AsciiProvider";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

type DisplayToggleProps = React.ComponentProps<typeof Tabs>;
export function DisplayToggle(props: DisplayToggleProps) {
  const { display, setDisplay } = useAsciiProvider();

  return (
    <Tabs
      value={display}
      onValueChange={(value) => setDisplay(value as typeof display)}
      {...props}
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="webcam" className="h-full space-x-2">
          <Camera className="size-3.5 text-muted-foreground" />
          <span className="leading-none">webcam</span>
        </TabsTrigger>
        <TabsTrigger value="upload" className="h-full space-x-2">
          <Upload className="size-3.5 text-muted-foreground" />
          <span className="leading-none">upload</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
