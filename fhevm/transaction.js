const Web3 = require('web3');
const fs = require('fs');
const fhevm = require('fhevmjs');
const Papa = require('papaparse');
const { performance } = require('perf_hooks');

// Initialize Web3 and connect to the local Ethereum node
const web3 = new Web3.default('https://devnet.zama.ai');

// Replace with your deployed contract address
const deployed_contractAddress = '0xe48d4c9acfd14014d55b5d78ffd06ea4f561d4d8';

// Replace with your private key
const privateKey = '0x7afdf33a1523bf6fb353261ab6d51884d0d1b2aa2c9c7e67bbd4f7fe0adae361';

// Validate the private key
if (privateKey.length !== 66 || !privateKey.startsWith('0x') || !/^[0-9a-fA-F]+$/.test(privateKey.slice(2))) {
    throw new Error('Invalid Private Key: Ensure it is 64 hex characters with 0x prefix.');
}

// Derive the account from the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(`Using account: ${account.address}`);

// Load the ABI of the Counter contract
const abi = JSON.parse(fs.readFileSync('./artifacts/examples/Counter.sol/Counter.json', 'utf8')).abi;

// Create a contract instance
const contract = new web3.eth.Contract(abi, deployed_contractAddress);

// Function to send a transaction to the add function of the Counter contract
async function sendAddTransaction(valueInput, inputProof) {
    try {
        // Estimate gas for the transaction
        const gasEstimate = await contract.methods.add(valueInput, inputProof).estimateGas({ from: account.address });

        console.log(`Estimated Gas: ${gasEstimate}`);

        // Get the latest transaction nonce for the account
        const nonce = await web3.eth.getTransactionCount(account.address, 'latest');

        // Create the transaction object
        const tx = {
            to: deployed_contractAddress,
            gas: gasEstimate,
            gasPrice: web3.utils.toWei('20', 'gwei'),
            nonce: nonce,
            data: contract.methods.add(valueInput, inputProof).encodeABI(),
            chainId: await web3.eth.getChainId()  // Automatically get the correct chain ID
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

        // Send the transaction and get the receipt
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log('Transaction successful with hash:', receipt.transactionHash);
        console.log('Contract call result:', receipt);

    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

async function main() {
    try {
        const instance = await fhevm.createInstance({ networkUrl: "http://localhost:8545" });
        console.log('Instance created:', instance);

        const contractAddress = '0x8Fdb26641d14a80FCCBE87BF455338Dd9C539a50';
        const userAddress = '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80';


        // Creating an encrypted input using fhevm instance
        const input = instance.createEncryptedInput(contractAddress, userAddress);
        
        // Encrypt the input with a value of 10
        const encrypted = await input.add32(10).encrypt();

        console.log('Encrypted input:', encrypted.handles);
        console.log('Input proof:', encrypted.inputProof);



        
        // Send the transaction with encrypted input and inputProof
        await sendAddTransaction(encrypted.handles, encrypted.inputProof);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
