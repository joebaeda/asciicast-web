"use client"

import { useEffect, useRef, useState } from "react";

type UploadType = "video" | null;

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [hasUpload, setHasUpload] = useState(false);
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [type, setType] = useState<UploadType>(null);
  const uploadRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationId = useRef<number | null>(null);

  function render() {
    if (!videoRef.current) return;
    paint(videoRef.current);
    animationId.current = requestAnimationFrame(render);
  }

  function paint(source: HTMLImageElement | HTMLVideoElement) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    const container = canvas?.parentElement;
    if (!canvas || !ctx || !container) return;
  
    const isVideo = source instanceof HTMLVideoElement;
    const sourceWidth = isVideo ? source.videoWidth : source.width;
    const sourceHeight = isVideo ? source.videoHeight : source.height;
  
    // Target aspect ratio (1:1)
    const targetAspectRatio = 1 / 1;
  
    // Calculate target dimensions to fit 1:1
    let targetWidth = sourceWidth;
    let targetHeight = Math.round(sourceWidth / targetAspectRatio);
  
    if (targetHeight > sourceHeight) {
      targetHeight = sourceHeight;
      targetWidth = Math.round(sourceHeight * targetAspectRatio);
    }
  
    // Center crop to maintain aspect ratio
    const offsetX = (sourceWidth - targetWidth) / 2;
    const offsetY = (sourceHeight - targetHeight) / 2;
  
    // Set canvas dimensions
    canvas.width = Math.round(targetWidth);
    canvas.height = Math.round(targetHeight);
  
    // Draw the cropped image or video on the canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      source,
      offsetX,
      offsetY,
      targetWidth,
      targetHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  

  async function uploadVideo(file: File) {
    setType("video");

    const video = document.createElement("video");
    videoRef.current = video;
    video.src = URL.createObjectURL(file);
    video.loop = true;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    await video.play();

    render();
  }

  async function upload(file: File) {
    if (isUploading || hasUpload) return;
    setIsUploading(true);

    clear();

    try {
      if (file.type.startsWith("video/")) {
        await uploadVideo(file);
      } else {
        setOnlyVideo(true)
      }

      setHasUpload(true);
    } catch {
      clear();
    } finally {
      setIsUploading(false);
    }
  }

  function clear() {
    setHasUpload(false);
    setType(null);

    if (uploadRef.current) {
      uploadRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.onloadedmetadata = null;
      videoRef.current = null;
    }

    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Resize canvas with container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const observer = new ResizeObserver(() => {
      if (hasUpload && uploadRef.current) paint(uploadRef.current);
    });

    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [hasUpload]);

  // Cleanup
  useEffect(() => {
    return clear;
  }, []);

  return {
    isUploading,
    hasUpload,
    onlyVideo,
    setOnlyVideo,
    type,
    inputRef,
    canvasRef,
    upload,
    clear,
  };
}
