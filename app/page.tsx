"use client";

import { Sidebar } from "./components/ui/sidebar";
import { UploadDisplay } from "./components/display/upload-display";
import { WebcamDisplay } from "./components/display/webcam-display";
import { useAsciiProvider } from "@/context/AsciiProvider";
import {
  SidebarContent,
  SidebarGroup,
  SidebarRail,
} from "./components/ui/sidebar";
import { Controls } from "./components/controls/controls";

export default function Page() {
  const { display } = useAsciiProvider();

  return (
    <div>
      {display === "webcam" ? (
        <WebcamDisplay fname={"joebaeda"} fid={"891914"} />
      ) : (
        <UploadDisplay fname={"joebaeda"} fid={"891914"} />
      )}
      <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
        <SidebarContent>
          <SidebarGroup>
            <Controls />
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
