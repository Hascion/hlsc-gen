# HLSC-gen: Halscion Meme Coin Generator

## What is HLSC-gen?
HLSC-gen is a web application that utilizes an Arbitrum Sepolia-based smart contract in order to generate the ERC20 token **Halscion** (`HLSC`) for any users that have invested stake into the contract. The website has the following functionalities:

- **Connect Wallet** -> allows users to connect their MetaMask wallet to the web application for staking and withdrawing
- **Stake** -> allows users to transfer some of their tokens to the contract in order to be eligible for accumulating reward based on the elapsed time since their first stake.
- **Reward Check** -> allows users to view how much reward they have accumulated for their stake, expressed in terms of HLSC Wei
- **Withdraw** -> allows users to reclaim their stake from the contract along with the reward they have accumulated

This app was made in partial fulfillment of CS172: Blockchain Fundamentals as a certification requirement for Arbitrum provided by the BLOKC.

> [!IMPORTANT]
> Currently, the created smart contract does not incorporate an invocable minting function and only generates the initial supply of tokens when the contract is first deployed to the owner of the contract. This means that if one were to test the staking and withdrawing functionality, one would first need to acquire some of the token from the owner. 