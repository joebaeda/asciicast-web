"use client"

import { useEffect, useRef, useState } from "react";
import { Download, Eye, EyeOff, Upload, X } from "lucide-react";

import { useAsciiProvider } from "@/context/AsciiProvider";
import { useUpload } from "@/hooks/use-upload";
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
import { BaseError, useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { asciiCastAbi, asciiCastAddress } from "@/lib/contract";
import { base } from "wagmi/chains";
import { parseEther } from "viem";
import { Wallets } from "../wallets";

type ArtistProps = {
  name: string;
  fname: string;
  pfp: string;
  fid: string;
}

export function UploadDisplay() {
  const { config } = useAsciiProvider();
  const {
    isUploading,
    hasUpload,
    onlyVideo,
    setOnlyVideo,
    type,
    inputRef: uploadInputRef,
    canvasRef: uploadCanvasRef,
    upload,
    clear,
  } = useUpload();
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
  } = useAscii(uploadCanvasRef.current, {
    ...config,
    animate: type === "video",
  });
  const initialised = useRef(false);
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
  }, [error])

  useEffect(() => {
    if (hasUpload) {
      if (!initialised.current) {
        showAscii();
        initialised.current = true;
      }
    } else {
      initialised.current = false;
    }
  }, [hasUpload, showAscii]);


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

  function toggleAscii() {
    if (isAsciiActive) {
      hideAscii();
    } else {
      if (uploadCanvasRef.current) showAscii();
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
          onClick={hasUpload ? clear : () => uploadInputRef.current?.click()}
          icon={hasUpload ? X : Upload}
          tooltip={hasUpload ? "Remove Upload" : "Upload Media"}
          loading={isUploading}
          disabled={!isConnected}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              upload(file);
              e.target.value = "";
            }
          }}
        />
        <DisplayActionButton
          onClick={toggleAscii}
          icon={!hasUpload || !isAsciiActive ? Eye : EyeOff}
          tooltip={!hasUpload || !isAsciiActive ? "Show ASCII" : "Hide ASCII"}
          disabled={!isConnected || !hasUpload || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayCopyButton
          onCopy={copyAscii}
          tooltip="Copy ASCII"
          disabled={!isConnected || !hasUpload || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayActionButton
          onClick={freeDownload}
          icon={Download}
          tooltip="Download ASCII"
          disabled={!isConnected || !hasUpload || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        {isConnected ? (
          <Button
            onClick={handleMint}
            disabled={!isConnected || !hasUpload || !isAsciiActive || chainId !== base.id || isPending || isConfirming || isConfirmed || isGenerating}
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-12 px-4 py-2 rounded-xl"
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
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-12 px-4 py-2 rounded-xl"
          >
            Connect Wallet
          </Button>
        )}
      </DisplayActionsContainer>

      <DisplayCanvasContainer>
        <DisplayInset className={cn({ hidden: hasUpload })}>
          <Button
            variant="secondary"
            onClick={() => uploadInputRef.current?.click()}
            disabled={!isConnected || isUploading}
          >
            <Upload className="size-4 text-muted-foreground" />
            Upload
          </Button>
        </DisplayInset>

        <div className="absolute inset-0 m-2 overflow-auto">
          <DisplayCanvas
            ref={uploadCanvasRef}
            className={cn("w-full", { hidden: isAsciiActive })}
          />
          <DisplayCanvas
            ref={asciiCanvasRef}
            className={cn("w-full", { hidden: !isAsciiActive })}
          />
        </div>
      </DisplayCanvasContainer>
      <DisplayFooterContainer>
        <div className="flex justify-center items-center">
          <span className="text-center py-2">Build with <span className="font-extrabold text-red-800">❤</span> by <a
            href="https://warpcast.com/joebaeda"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-green-500"
          >Joe bae</a></span>
        </div>
      </DisplayFooterContainer>

      {/* Transaction Error */}
      {showError && error && (
        <div className="fixed flex p-4 inset-0 items-center justify-center z-50 bg-gray-900 bg-opacity-65">
          <div className="w-full h-full items-center justify-center rounded-lg p-4 flex flex-col max-h-[360px] max-w-[360px] mx-auto bg-[#250f31] space-y-4">
            <p className="text-center text-white">Error: {(error as BaseError).shortMessage || error.message}</p>
            <Button
              onClick={() => setShowError(false)}
              variant="secondary"
              disabled={isPending}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Not Video */}
      {onlyVideo && (
        <div className="fixed flex p-4 inset-0 items-center justify-center z-50 bg-gray-900 bg-opacity-65">
          <div className="w-full h-full items-center justify-center rounded-lg p-4 flex flex-col max-h-[360px] max-w-[360px] mx-auto bg-[#250f31] space-y-4">
            <p className="text-center text-white">Sorry, ASCII Art Animation Frame only supports Video to be converted into Animation.</p>
            <Button
              onClick={() => setOnlyVideo(false)}
              variant="secondary"
              disabled={isPending}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Wallet Options Modal */}
      {isConnectWalletOpen && (
        <div className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#1f1f1f] rounded-2xl p-6 w-full max-w-[384px] shadow-lg">
            {/* Modal Header */}
            <div className="absolute top-1 right-2">
              <button
                onClick={() => setConnectWalletOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Wallet Options */}
            <Wallets onConnect={() => setConnectWalletOpen(false)} />
          </div>
        </div>
      )}

    </DisplayContainer>
  );
}