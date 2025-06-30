import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { address } = req.body;

  if (!ethers.utils.isAddress(address)) {
    res.status(400).json({ error: "Invalid address" });
    return;
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const token = new ethers.Contract(
    process.env.TOKEN_ADDRESS,
    [
      "function transfer(address to, uint amount) public returns (bool)"
    ],
    wallet
  );

  try {
    const tx = await token.transfer(address, process.env.TOKEN_AMOUNT_WEI);
    await tx.wait();
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
Add /api/drip endpoint
