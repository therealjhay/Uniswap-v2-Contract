const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);


  const USDC = await ethers.getContractAt(
    "IERC20",
    USDCAddress,
    impersonatedSigner,
  );
  const DAI = await ethers.getContractAt(
    "IERC20",
    DAIAddress,
    impersonatedSigner,
  );
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    UNIRouter,
    impersonatedSigner,
  );


  const usdcBalBefore = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalBefore = await DAI.balanceOf(impersonatedSigner.address);
  console.log(
    "=================Before========================================",
  );

  console.log("USDC Balance before adding liquidity:", Number(usdcBalBefore));
  console.log("DAI Balance before adding liquidity:", Number(daiBalBefore));

  
  // Swap param
 const amountIn = ethers.parseUnits("200", 6); //usdc to be swapped
  const amountOutMin = ethers.parseUnits("195", 18); // minDai to be recieved
  const path = [USDCAddress, DAIAddress];
  const to = impersonatedSigner.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const usdcBalanceBefore = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalanceBefore = await DAI.balanceOf(impersonatedSigner.address);

  await USDC.approve(UNIRouter, amountIn);

  console.log("--------Before-------");

  console.log("Usdc balance bfr",Number(usdcBalanceBefore));
  console.log("Dai balance bfr", Number(daiBalanceBefore));

  const transaction = await ROUTER.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    impersonatedSigner,
    deadline,
  );

  await transaction.wait();

  console.log("------After-----")

  const usdcBalanceAfter = await USDC.balanceOf(impersonatedSigner.address);
  const daiBalanceAfter = await DAI.balanceOf(impersonatedSigner.address);

  console.log("Usdc Balance afr", Number(usdcBalanceAfter));
  console.log("Dai Balance afr", Number(daiBalanceAfter));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
