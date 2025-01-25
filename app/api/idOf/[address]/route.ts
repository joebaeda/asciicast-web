import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { idRegistryABI } from "@farcaster/core"
import { truncateAddress } from "@/lib/truncateAddress"

const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io") // Optimism RPC URL

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.pathname.split("/").pop()

    if (!ethers.isAddress(address)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
    }

    const contract = new ethers.Contract(
      "0x00000000Fc6c5F01Fc30151999387Bb99A9f489b", // Mainnet contract address
      idRegistryABI,
      provider,
    )

    const idOf = await contract.idOf(address)
    const fid = Number(idOf) // Convert BigNumber to regular number

    if (!idOf) {
      // Return fake user data if `fid` is not found
      const fakeUserData = {
        name: "Anonymous",
        fname: truncateAddress(address), // Generate a fake username from the wallet address
        pfp: "https://www.asciicast.com/icon.jpg", // Placeholder profile picture URL
        fid: "0",
      }
      return NextResponse.json(fakeUserData)
    }

    const response = await fetch(`https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`)
    }

    const userData = await response.json()

    // Initialize extracted data fields
    let name = ""
    let fname = ""
    let pfp = ""

    // Extract relevant fields
    for (const message of userData.messages) {
      const { type, value } = message.data.userDataBody
      if (type === "USER_DATA_TYPE_DISPLAY") name = value
      if (type === "USER_DATA_TYPE_USERNAME") fname = value
      if (type === "USER_DATA_TYPE_PFP") pfp = value
    }

    return NextResponse.json({ name, fname, pfp, fid })
  } catch (error) {
    console.error("Error fetching ID:", error)
    return NextResponse.json({ error: "Failed to fetch ID from contract" }, { status: 500 })
  }
}