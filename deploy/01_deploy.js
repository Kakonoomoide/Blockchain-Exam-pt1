const { ethers } = require("ethers");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const rpcUrl = process.env.CMU_RPC_URL;
  const chainId = Number(process.env.CMU_CHAIN_ID);

  if (!rpcUrl || !process.env.PRIVATE_KEY) {
    throw new Error(
      "CMU_RPC_URL / PRIVATE_KEY tidak ada. Jalankan lewat `cmu deploy`, bukan langsung dengan node.",
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Hasil `cmu compile` ada di artifacts/Guestbook.json
  const artifactPath = path.resolve("artifacts", "Guestbook.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.evm.bytecode.object,
    wallet,
  );

  console.log("Deployer :", wallet.address);
  console.log("Deploying Guestbook...");

  const guestbook = await factory.deploy();
  await guestbook.waitForDeployment(); // nunggu ke-mine, pastikan miner jalan

  const address = await guestbook.getAddress();
  console.log("Guestbook deployed to:", address);

  // Tes: tulis 1 pesan lalu baca balik
  console.log("Menulis pesan pertama...");
  const tx = await guestbook.sign("Budi", "Halo dari Jogja!");
  await tx.wait();

  const total = await guestbook.totalEntries();
  const first = await guestbook.getEntry(0);
  console.log("Total entri :", total.toString());
  console.log("Entri #0    :", first.name, "-", first.message);
}

main().catch((error) => {
  // Non-zero exit supaya `cmu deploy` berhenti kalau gagal
  console.error(error);
  process.exitCode = 1;
});
