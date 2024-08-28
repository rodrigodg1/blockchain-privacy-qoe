const fhevm = require('fhevmjs');

async function main() {
    try {
        // Create an instance of FHEVM with the specified network URL
        const instance = await fhevm.createInstance({ networkUrl: "http://localhost:8545" });
        console.log('Instance created:', instance);

        // Define the number you want to encrypt
        const numberToEncrypt = 42;
        
        contractAddress = '0x8Fdb26641d14a80FCCBE87BF455338Dd9C539a50';
        userAddress = '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80';
        // Encrypt the number using the FHEVM instance
        const input = instance.createEncryptedInput(contractAddress, userAddress);
        const encrypted = input.add64(numberToEncrypt).encrypt();
        //const test = input.

        // Log the encrypted result
        console.log('Encrypted number:', encrypted);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

