"use client"

import { Camera, CameraOff, Download, Eye, EyeOff } from "lucide-react";

import { useAsciiProvider } from "@/context/AsciiProvider";
import { useWebcam } from "@/hooks/use-webcam";
import { useAscii } from "@/hooks/use-ascii";
import { cn } from "@/lib/utils";
import { DisplayActionButton } from "../../components/display/display-action-button";
import {
  DisplayActionsContainer,
  DisplayCanvas,
  DisplayCanvasContainer,
  DisplayContainer,
  DisplayFooterContainer,
  DisplayInset,
} from "../../components/display/display-containers";
import { DisplayCopyButton } from "../../components/display/display-copy-button";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { BaseError, useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { asciiCastAbi, asciiCastAddress } from "@/lib/contract";
import { parseEther } from "viem";
import { base } from "wagmi/chains";
import { Wallets } from "../wallets";
import Footer from "../footer";
import InstallPWA from "../pwa/install";

type ArtistProps = {
  name: string;
  fname: string;
  pfp: string;
  fid: string;
}

export function WebcamDisplay() {
  const { config } = useAsciiProvider();
  const {
    isLoading: isWebcamLoading,
    isActive: isWebcamActive,
    canvasRef: webcamCanvasRef,
    start: _startWebcam,
    stop: _stopWebcam,
  } = useWebcam();
  const {
    isActive: isAsciiActive,
    canvasRef: asciiCanvasRef,
    asciiColor: animationColor,
    asciiPreset: animationPreset,
    show: showAscii,
    hide: hideAscii,
    copy: copyAscii,
    download: freeDownload,
    saveImageHash: imageHash,
    saveAnimationHash: animationHash
  } = useAscii(webcamCanvasRef.current, {
    ...config,
    animate: true,
  });

  const [showError, setShowError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnectWalletOpen, setConnectWalletOpen] = useState(false);
  const [artist, setArtist] = useState<ArtistProps>({
    name: "",
    fname: "",
    pfp: "",
    fid: "",
  });

  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  const { data: tokenId } = useReadContract({
    address: asciiCastAddress as `0x${string}`,
    abi: asciiCastAbi,
    functionName: "totalSupply",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConnected) {
      const storedData = localStorage.getItem(`userData-${address}`);
      if (storedData) {
        const artistData: ArtistProps = JSON.parse(storedData);
        setArtist(artistData)
      }
    }
  }, [address, isConnected])

  useEffect(() => {
    if (error) {
      setShowError(true)
    }

  }, [chainId, error])

  const shareCast = async () => {
    try {

      const message = {
        castText: "A NEW ASCII HAS BEEN MINTED ONCHAIN!",
        siteUrl: `https://opensea.io/assets/base/0x837969d05cb1c8108356bc49e58e568c2698d90c/${Number(tokenId) + 1}`,
      }

      const response = await fetch("/api/share-cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share cast.");
      }

      console.log("Cast shared successfully:", data);
    } catch (error: unknown) {
      console.error("Error sharing cast:", (error as Error).message);
    }

  }

  function startWebcam() {
    _startWebcam();
    showAscii();
  }

  function stopWebcam() {
    _stopWebcam();
    hideAscii();
  }

  function toggleAscii() {
    if (isAsciiActive) {
      hideAscii();
    } else {
      if (webcamCanvasRef.current) showAscii();
    }
  }

  const handleMint = async () => {
    setIsGenerating(true)

    try {
      const ipfsImageHash = await imageHash();
      const ipfsAnimationHash = await animationHash();

      setIsGenerating(false);

      if (ipfsImageHash && ipfsAnimationHash) {
        // Call the mint contract
        writeContract({
          abi: asciiCastAbi,
          chainId: base.id,
          address: asciiCastAddress as `0x${string}`,
          functionName: "mint",
          value: parseEther("0.003"),
          args: [`ipfs://${ipfsImageHash}`, `ipfs://${ipfsAnimationHash}`, `@${artist.fname}`, animationColor, animationPreset, String(artist.fid)],
        });

        await shareCast()

      } else {
        console.error("Failed to mint animation to base")
      }
    } catch (error: unknown) {
      console.error("Error during minting or sharing:", (error as Error).message);
    } finally {
      setIsGenerating(false); // Always stop loading indicator
    }
  };

  return (
    <DisplayContainer>
      <DisplayActionsContainer>
        <DisplayActionButton
          onClick={isWebcamActive ? stopWebcam : startWebcam}
          icon={isWebcamActive ? CameraOff : Camera}
          tooltip={isWebcamActive ? "Stop webcam" : "Start webcam"}
          loading={isWebcamLoading}
          disabled={!isConnected}
        />
        <DisplayActionButton
          onClick={toggleAscii}
          icon={!isWebcamActive || !isAsciiActive ? Eye : EyeOff}
          tooltip={
            !isWebcamActive || !isAsciiActive ? "Show ASCII" : "Hide ASCII"
          }
          disabled={!isConnected || !isWebcamActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayCopyButton
          onCopy={copyAscii}
          tooltip="Copy ASCII"
          disabled={!isConnected || !isWebcamActive || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayActionButton
          onClick={freeDownload}
          icon={Download}
          tooltip="Download ASCII"
          disabled={!isConnected || !isWebcamActive || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        {isConnected ? (
          <Button
            onClick={handleMint}
            disabled={!isConnected || !isWebcamActive || !isAsciiActive || chainId !== base.id || isPending || isConfirming || isConfirmed || isGenerating}
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-11 px-3 py-2 rounded-xl"
          >
            {isGenerating ? "Generating..." : isPending
              ? "Confirming..."
              : isConfirming
                ? "Waiting..."
                : isConfirmed ? "Minted! 🎉" : "Mint to Base"}
          </Button>
        ) : (
          <Button
            onClick={() => setConnectWalletOpen(true)}
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-11 px-3 py-2 rounded-xl"
          >
            Sign In
          </Button>
        )}
      </DisplayActionsContainer>

      <DisplayCanvasContainer>
        <DisplayInset className={cn({ hidden: isWebcamActive })}>
          <Button
            variant="secondary"
            onClick={startWebcam}
            disabled={!isConnected || isWebcamLoading}
          >
            <Camera className="size-4 text-muted-foreground" />
            Start
          </Button>
        </DisplayInset>

        <div className="absolute inset-0 m-2 overflow-auto">
          <DisplayCanvas
            ref={webcamCanvasRef}
            className={cn({ hidden: isAsciiActive })}
          />
          <DisplayCanvas
            ref={asciiCanvasRef}
            className={cn({ hidden: !isAsciiActive })}
          />
        </div>
      </DisplayCanvasContainer>
      <DisplayFooterContainer>
        <Footer />
      </DisplayFooterContainer>

      {/* Transaction Error */}
      {showError && error && (
        <div onClick={() => setShowError(false)} className="fixed flex p-4 inset-0 items-center justify-center z-50 bg-gray-900 bg-opacity-65">
          <div className="w-full h-full items-center justify-center rounded-lg p-4 flex max-h-[360px] max-w-[360px] mx-auto bg-[#250f31] space-y-4">
            <p className="text-center text-white">Error: {(error as BaseError).shortMessage || error.message}</p>
          </div>
        </div>
      )}

      {/* Wallet Options Modal */}
      {isConnectWalletOpen && (
        <div onClick={() => setConnectWalletOpen(false)} className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] rounded-2xl p-6 w-full max-w-[384px] shadow-lg">
            {/* Wallet Options */}
            <Wallets onConnect={() => setConnectWalletOpen(false)} />
          </div>
        </div>
      )}

      <InstallPWA />

    </DisplayContainer>
  );
}
