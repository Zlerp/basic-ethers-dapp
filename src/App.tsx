import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "./abi.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const App = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [doSomeReadResponse, setDoSomeReadResponse] = useState<string | null>(
    null
  );
  const [doSomeWriteResponse, setDoSomeWriteResponse] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();

      const ethersContract = new ethers.Contract(
        "0xe8c11ac34398d64ed5c063873d507c310b84a6f5",
        abi,
        signer
      );
      setContract(ethersContract);
    }
  }, [provider]);

  const doSomeRead = async () => {
    if (!contract) return;
    const result = await contract.name();
    setDoSomeReadResponse(result.toString());
  };

  const doSomeWrite = async () => {
    if (!contract) return;
    const result = await contract.mintNFTs([1], {
      value: ethers.utils.parseEther("0.000001"),
    });
    setDoSomeWriteResponse(JSON.stringify(result));
  };

  console.log(contract);

  return (
    <div>
      {!account && <button onClick={connectWallet}>Connect Wallet</button>}
      {account && (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      )}

      {provider && <button onClick={doSomeRead}>Do some read</button>}
      {doSomeReadResponse && <p>{doSomeReadResponse}</p>}

      {account && <button onClick={doSomeWrite}>Do some write</button>}
      {doSomeWriteResponse && <p>{doSomeWriteResponse}</p>}
    </div>
  );
};

export default App;
