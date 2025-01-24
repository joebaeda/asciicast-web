"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { AsciiConfig, generateAsciiText, renderAscii } from "@/lib/ascii";
import utcDateTime from "@/lib/utcDateTime";

export function useAscii(
  source: HTMLCanvasElement | null,
  config: AsciiConfig,
) {
  const [isActive, setIsActive] = useState(false);
  const [asciiColor, setAsciiColor] = useState("");
  const [asciiPreset, setAsciiPreset] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number | null>(null);

  const render = useCallback(() => {
    const target = canvasRef.current;
    if (!source || !target) return;

    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }

    renderAscii(source, target, config);
    setAsciiColor(config.colour);
    setAsciiPreset(config.chars)

    if (config.animate) {
      animationId.current = requestAnimationFrame(render);
    }

  }, [source, config]);

  function show() {
    setIsActive(true);
    render();
  }

  function hide() {
    setIsActive(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
  }

  async function copy() {
    if (!source) return false;

    const ascii = await generateAsciiText(source, config);
    try {
      await navigator.clipboard.writeText(ascii);
      return true;
    } catch {
      return false;
    }
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    // Get the current UTC date and time
    const utcDateTimeString: string = utcDateTime.getUTCDateTime();
    link.download = `asciicast-${utcDateTimeString}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function saveImageHash() {
    const canvas = canvasRef.current;
    if (canvas) {

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/png');

      // Convert data URL to Blob
      const blob = await fetch(dataURL).then(res => res.blob());

      // Create FormData for Pinata upload
      // Get the current UTC date and time
      const utcDateTimeString: string = utcDateTime.getUTCDateTime();
      const formData = new FormData();
      formData.append('file', blob, `asciicast-image-${utcDateTimeString}`);
      try {

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });


        const data = await response.json();

        if (response.ok) {
          return data.ipfsHash; // Set the IPFS hash on success
        } else {
          console.log({ message: 'Something went wrong', type: 'error' });
        }
      } catch (err) {
        console.log({ message: 'Error uploading file', type: 'error', error: err });
      }
    }
  }

  async function generateAnimation(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error("Canvas not found"));
        return;
      }

      // Capture the stream from the canvas at the specified FPS
      const stream = canvas.captureStream();
      const recordedBlobs: Blob[] = [];

      // Create the MediaRecorder to capture the video stream
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedBlobs, { type: 'video/mp4' });
        resolve(videoBlob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('Error while recording video: ' + event.error));
      };

      // Start recording
      mediaRecorder.start();

      // Define a function to render frames at the desired FPS
      const renderFrames = () => {
        if (mediaRecorder.state === "recording") {
          // The frame is captured directly by the media recorder

          // Use requestAnimationFrame to continue capturing frames at the correct FPS
          const interval = 1000 / 60;
          setTimeout(() => {
            requestAnimationFrame(renderFrames);
          }, interval);
        }
      };

      // Start rendering frames after the media recorder is initialized
      renderFrames();

      // Stop recording after a certain duration (e.g., 15 seconds or longer)
      const recordDuration = 15000; // Adjust the time as needed
      setTimeout(() => {
        mediaRecorder.stop();
      }, recordDuration);
    });
  }

  async function saveAnimationHash() {
    try {
      // Generate the video Blob using the generateAnimation function
      const videoBlob = await generateAnimation();
  
      // Check if the generated Blob is valid
      if (!videoBlob) {
        throw new Error("Video Blob is empty or undefined.");
      }
  
      // Get the current UTC date and time
      const utcDateTimeString: string = utcDateTime.getUTCDateTime();
  
      // Prepare FormData for Pinata upload
      const formData = new FormData();
      formData.append("file", videoBlob, `asciicast-video-${utcDateTimeString}`);
  
      // Upload to your API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      // Parse the response JSON
      const data = await response.json();
  
      if (response.ok) {
        console.log("Animation hash saved successfully:", data.ipfsHash);
        return data.ipfsHash; // Return the IPFS hash on success
      } else {
        console.error("Error response from /api/upload:", data);
        throw new Error(data.message || "Failed to upload animation.");
      }
    } catch (error) {
      console.error("Failed to save Animation hash:", error);
      throw error; // Rethrow the error for higher-level handling
    }
  }


  // Reset animation on config change
  useEffect(() => {
    if (isActive) {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
      render();
    }
  }, [config, isActive, render]);

  // Resize canvas with container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const observer = new ResizeObserver(() => {
      if (isActive) render();
    });

    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [isActive, render]);

  // Cleanup
  useEffect(() => {
    return hide;
  }, []);

  return { isActive, asciiColor, asciiPreset, canvasRef, show, hide, copy, download, saveImageHash, saveAnimationHash };
}
