const Web3 = require('web3').default;
const { abi, bytecode } = require('./artifacts/examples/Rand.sol/Rand.json'); // Adjust the path

// Use the provided MetaMask private key (with 0x prefix)
const privateKey = '0x3a62e8e800654214cce6f8da0fb0614f1ab21ce72ffcd1e3c9b232d833373447';

// Convert private key to Buffer (if necessary)
//const privateKeyBuffer = Buffer.from(privateKey.slice(2), 'hex');

// Set up your Web3 provider (replace with your RPC node URL)
const web3 = new Web3('https://devnet.zama.ai');

// Derive the account from the private key
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
// Set up the contract
const contract = new web3.eth.Contract(abi);

// Deploy the contract
const deployContract = async () => {
    try {
        // Get the nonce for the account
        const nonce = await web3.eth.getTransactionCount(account.address);

        // Estimate gas needed for deployment
        const gasEstimate = await contract.deploy({
            data: bytecode
        }).estimateGas();

        // Build the transaction
        const txObject = {
            nonce: web3.utils.toHex(nonce),
            gasLimit: web3.utils.toHex(gasEstimate),
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
            data: contract.deploy({ data: bytecode }).encodeABI(),
            from: account.address,
            chainId: await web3.eth.getChainId() // Get the current chain ID
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        // Log the contract address to the console
        console.log('Contract deployed at address:', receipt.contractAddress);
    } catch (error) {
        console.error('Error deploying contract:', error);
    }
};

// Execute the deployment
deployContract();
