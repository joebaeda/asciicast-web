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
import Footer from "../footer";
import InstallPWA from "../pwa/install";

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
        castText: "a new ascii video has been minted onchain",
        siteUrl: `https://opensea.io/assets/base/0x837969d05cb1c8108356bc49e58e568c2698d90c/${Number(tokenId) + 1}`,
      }

      const response = await fetch("/api/share-cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "failed to share cast.");
      }

      console.log("cast shared successfully:", data);
    } catch (error: unknown) {
      console.error("error sharing cast:", (error as Error).message);
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
        console.error("failed to mint ascii to base")
      }
    } catch (error: unknown) {
      console.error("error during minting or sharing:", (error as Error).message);
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
          tooltip={hasUpload ? "remove" : "upload"}
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
          tooltip={!hasUpload || !isAsciiActive ? "show" : "hide"}
          disabled={!isConnected || !hasUpload || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayCopyButton
          onCopy={copyAscii}
          tooltip="copy"
          disabled={!isConnected || !hasUpload || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        <DisplayActionButton
          onClick={freeDownload}
          icon={Download}
          tooltip="download"
          disabled={!isConnected || !hasUpload || !isAsciiActive || isPending || isConfirming || isConfirmed || isGenerating}
        />
        {isConnected ? (
          <Button
            onClick={handleMint}
            disabled={!isConnected || !hasUpload || !isAsciiActive || chainId !== base.id || isPending || isConfirming || isConfirmed || isGenerating}
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-11 px-3 py-2 rounded-xl"
          >
            {isGenerating ? "generating..." : isPending
              ? "confirming..."
              : isConfirming
                ? "waiting..."
                : isConfirmed ? "minted! 🎉" : "mint to base"}
          </Button>
        ) : (
          <Button
            onClick={() => setConnectWalletOpen(true)}
            className="bg-pink-900 hover:bg-pink-950 text-white absolute right-11 px-3 py-2 rounded-xl"
          >
            signin
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
            upload
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
        <Footer />
      </DisplayFooterContainer>

      {/* Transaction Error */}
      {showError && error && (
        <div onClick={() => setShowError(false)} className="fixed flex p-4 inset-0 items-center justify-center z-50 bg-gray-900 bg-opacity-65">
          <div className="w-full h-full items-center justify-center rounded-lg p-4 flex max-h-[360px] max-w-[360px] mx-auto bg-[#250f31] space-y-4">
            <p className="text-center text-white">error: {(error as BaseError).shortMessage || error.message}</p>
          </div>
        </div>
      )}

      {/* Not Video */}
      {onlyVideo && (
        <div onClick={() => setOnlyVideo(false)} className="fixed flex p-4 inset-0 items-center justify-center z-50 bg-gray-900 bg-opacity-65">
          <div className="w-full h-full items-center justify-center rounded-lg p-4 flex max-h-[360px] max-w-[360px] mx-auto bg-[#250f31] space-y-4">
            <p className="text-center text-white">sorry, asciicast app only supports video to be converted into ascii.</p>
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