"use client"

import { useEffect, useRef, useState } from "react";

export function useWebcam() {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number | null>(null);

  function render() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!video || !canvas || !ctx) {
      animationId.current = requestAnimationFrame(render);
      return;
    }
  
    // Early return if video is not ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationId.current = requestAnimationFrame(render);
      return;
    }
  
    // Fit to 1:1 aspect ratio
    const targetAspectRatio = 1 / 1;
    const canvasHeight = video.videoHeight;
    const canvasWidth = Math.round(canvasHeight * targetAspectRatio);
  
    // Set canvas dimensions to match the target aspect ratio
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    const videoAspectRatio = video.videoWidth / video.videoHeight;
  
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;
    let offsetX = 0;
    let offsetY = 0;
  
    if (videoAspectRatio > targetAspectRatio) {
      // Video is wider than target, crop horizontally
      sourceWidth = video.videoHeight * targetAspectRatio;
      offsetX = (video.videoWidth - sourceWidth) / 2;
    } else if (videoAspectRatio < targetAspectRatio) {
      // Video is taller than target, crop vertically
      sourceHeight = video.videoWidth / targetAspectRatio;
      offsetY = (video.videoHeight - sourceHeight) / 2;
    }
  
    // Draw the cropped and scaled video on the canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      video,
      offsetX,
      offsetY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  
    animationId.current = requestAnimationFrame(render);
  }
  

  async function start() {
    if (isLoading || isActive) return;
  
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 1 / 1,
          width: { ideal: 1080 }, // Ideal width for a 1080x1080 resolution
          height: { ideal: 1080 }, // Ideal height for a 1080x1080 resolution
        },
      });
      streamRef.current = stream;
  
      const video = document.createElement("video");
      videoRef.current = video;
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      await video.play();
  
      render();
      setIsActive(true);
    } catch (error) {
      console.error("Error starting webcam:", error);
      stop();
    } finally {
      setIsLoading(false);
    }
  }
  

  function stop() {
    setIsActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current = null;
    }

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

  useEffect(() => {
    return stop;
  }, []);

  return {
    isLoading,
    isActive,
    canvasRef,
    start,
    stop,
  };
}
