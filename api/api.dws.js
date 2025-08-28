import { ethers } from "ethers";

const BASE_RPC = "https://mainnet.base.org";
const TOKEN = "0xeed0b37580fd9ee711f0a477b2be5c306b41ef12";
const LP_LOCK = "0x149f3218ba3ad135ec7f8c3374df68b1533f19cb";

const abi = [
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const provider = new ethers.JsonRpcProvider(BASE_RPC);
const contract = new ethers.Contract(TOKEN, abi, provider);

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    const q = (url.searchParams.get("q") || "").toLowerCase();

    if (q === "circulating" || q === "circulating_supply") {
      const [total, lpBal, decimals] = await Promise.all([
        contract.totalSupply(),
        contract.balanceOf(LP_LOCK),
        contract.decimals()
      ]);

      const circulating = total - lpBal;
      const display = ethers.formatUnits(circulating, decimals);

      res.setHeader("Content-Type", "text/plain");
      res.send(display);
      return;
    }

    res.setHeader("Content-Type", "text/plain");
    res.send("NA");
  } catch (err) {
    res.setHeader("Content-Type", "text/plain");
    res.send("NA");
  }
}
