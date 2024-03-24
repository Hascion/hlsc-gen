<script lang="ts">
    import { ethers, isError } from 'ethers';
    import type { BrowserProvider, JsonRpcSigner } from 'ethers';
    import { onMount } from 'svelte';
    import { Halscion__factory } from '$lib/typechain-types';

    let deployment_address = "0xC57A3c913516f0B03D51aE7A63EFDD5cc7aD26F1";

    const connectWallet = async () => {
        const { ethereum } = window as any;
        await ethereum.request({method:"eth_requestAccounts"});
        const provider = new ethers.BrowserProvider(ethereum);
        const contract = Halscion__factory.connect(deployment_address, provider);
        const account = await provider.send("eth_accounts", []);
        walletAddress = account[0];
        balance = Number(await contract.balanceOf(walletAddress)) / 10 ** 18;
        totalStake = Number(await contract.getStake(walletAddress)) / 10 ** 18;
    };
    
    const doStake = async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = Halscion__factory.connect(deployment_address, signer);
        
        try{
            let stakeInputConverted = BigInt(Number(stakeInput) * 10 ** 18);
            await contract.stake(stakeInputConverted);
            stakeInput = '';

        } catch (error: unknown) {
            if (isError(error, "ACTION_REJECTED")){
                alert(`Error: ${error.reason}`)
            } else if (isError(error, "CALL_EXCEPTION")) {
                alert(`Error: ${error.reason}`);
            }
        }

        balance = Number(await contract.balanceOf(walletAddress)) / 10 ** 18;
        totalStake = Number(await contract.getStake(walletAddress)) / 10 ** 18;
    };

    const getReward = async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = Halscion__factory.connect(deployment_address, signer);

        try{
            const reward = await contract.getCurrentReward(walletAddress);
            alert(`You currently have ${reward} in terms of HLSC Wei!`);

        } catch (error: unknown) {
            if (isError(error,"CALL_EXCEPTION")){
                alert(`Error: ${error.reason}`)
            }
        }

        balance = Number(await contract.balanceOf(walletAddress)) / 10 ** 18;
        totalStake = Number(await contract.getStake(walletAddress)) / 10 ** 18;
    };

    const doWithdraw = async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = Halscion__factory.connect(deployment_address, signer);

        try{
            await contract.withdraw();

        } catch (error: unknown) {
            if (isError(error, "ACTION_REJECTED")){
                alert(`Error: ${error.reason}`)
            } else if (isError(error, "CALL_EXCEPTION")) {
                alert(`Error: ${error.reason}`);
            }
        }

        balance = Number(await contract.balanceOf(walletAddress)) / 10 ** 18;
        totalStake = Number(await contract.getStake(walletAddress)) / 10 ** 18;
    };

    const refresh = async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = Halscion__factory.connect(deployment_address, signer);

        balance = Number(await contract.balanceOf(walletAddress)) / 10 ** 18;
        totalStake = Number(await contract.getStake(walletAddress)) / 10 ** 18;
        hlscTokenAmt = Number(await contract.totalSupply!()) / 10 ** 18;
    }
    
    let walletAddress = "";
    let hlscTokenAmt = 0;
    let totalStake = 0;
    let balance = 0;
    let stakeInput = '';

    onMount(async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const contract = Halscion__factory.connect(deployment_address, provider);
        hlscTokenAmt = Number(await contract.totalSupply!()) / 10 ** 18;
    })
</script>

<div class="relative py-16 bg-gradient-to-br from-sky-500 to-cyan-500 overflow-auto max-h-full">  
    <div class="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40">
        <div class="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
            <div class="rounded-xl bg-white shadow-xl">
                <div class="p-6 sm:p-16">
                    <div class="space-y-4">
                        <h2 class="mb-8 text-center text-3xl text-cyan-900 font-bold">HLSC (Halscion) <br> Meme Coin Generator</h2>

                        <div class="space-y-4 text-gray-600 text-center sm:-mb-8">
                            <p class="text-xs">Please make sure to click the Refresh button <br> below to get the latest values after each operation!</p>
                        </div>
                        
                        <p class="mb-8 text-center text-1md text-cyan-900"> Total amount of HLSC tokens: <strong>{hlscTokenAmt}</strong></p>
                        {#if walletAddress}
                        <p class="mb-1 text-center text-1md text-cyan-900">Wallet Connected: {walletAddress}</p>

                        <p class="mb-8 text-center text-1md text-cyan-900"> Your HLSC Balance: <strong>{balance}</strong></p>

                        <p class="mb-8 text-center text-1md text-cyan-900"> Total amount of stake: <strong>{totalStake}</strong></p>
                        {/if}
                        
                    </div>
                    <div class="mt-16 grid space-y-4">
                        {#if !walletAddress}
                            <button class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                            hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" on:click={connectWallet}>
                                <div class="relative flex items-center space-x-4 justify-center">
                                    <span class="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Connect Wallet</span>
                                </div>
                            </button>
                        {/if}
                        {#if walletAddress} 
                            <input type="text" class="group h-12 px-6 border-2 border-gray-300 transition duration-300 
                            hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" bind:value={stakeInput} placeholder="Input your stake amount here...">

                            <button class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" on:click={doStake}>
                                <div class="relative flex items-center space-x-4 justify-center">
                                    <span class="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Stake</span>
                                </div>
                            </button>

                            <button class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" on:click={getReward}>
                            <div class="relative flex items-center space-x-4 justify-center">
                                <span class="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Reward Check</span>
                            </div>
                            </button>

                            <button class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" on:click={doWithdraw}>
                                <div class="relative flex items-center space-x-4 justify-center">
                                    <span class="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Withdraw</span>
                                </div>
                            </button>
                        {/if}
                        
                        <button class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100" on:click={refresh}>
                            <div class="relative flex items-center space-x-4 justify-center">
                                <span class="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Refresh</span>
                            </div>
                        </button>

                    </div>
                    
                    <div class="mt-32 space-y-4 text-gray-600 text-center sm:-mb-8">
                        <p class="text-xs"> Hello! If you are checking this web-app and are in need of some of the token to test out the staking features, please ask the creator to send you some!</p>
                        <p class="text-xs">Thank you for trying the Halscion Generator!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>