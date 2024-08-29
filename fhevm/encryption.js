const fhevm = require('fhevmjs');
const fs = require('fs');
const Papa = require('papaparse');
const { performance } = require('perf_hooks');

async function encryptValue(instance, contractAddress, userAddress, value) {
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    const startTime = performance.now();
    const encrypted = await input.add16(value).encrypt();
    const endTime = performance.now();

    const encryptionTime = endTime - startTime;
    const encryptedStr = typeof encrypted === 'string' ? encrypted : JSON.stringify(encrypted);
    const encryptedSizeBytes = Buffer.byteLength(encryptedStr, 'utf8');
    const encryptedSizeKB = encryptedSizeBytes / 1024;

    return { encrypted: encryptedStr, encryptionTime, encryptedSizeKB };
}

async function main() {
    try {
        const instance = await fhevm.createInstance({ networkUrl: "http://localhost:8545" });
        console.log('Instance created:', instance);

        const contractAddress = '0x8Fdb26641d14a80FCCBE87BF455338Dd9C539a50';
        const userAddress = '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80';

        const csvFile = fs.readFileSync('pokemon_encoded.csv', 'utf8');
        Papa.parse(csvFile, {
            header: true,
            complete: async (results) => {
                const columns = ['QoS_type', 'QoD_model', 'QoD_os-version', 'QoS_operator', 'MOS'];
                const encryptionResults = {};

                for (const column of columns) {
                    encryptionResults[column] = [];
                }

                for (const row of results.data) {
                    for (const column of columns) {
                        let value = row[column];
                        if (column === 'MOS' || column === 'QoS_type' || column === 'QoS_operator') {
                            value = parseFloat(value);
                            if (isNaN(value)) continue;
                        }

                        const { encrypted, encryptionTime, encryptedSizeKB } = await encryptValue(instance, contractAddress, userAddress, value);

                        console.log(`Encrypted ${column} value: ${encrypted}`);
                        console.log(`Encryption time: ${encryptionTime.toFixed(3)} ms`);
                        console.log(`Encrypted size: ${encryptedSizeKB.toFixed(3)} KB`);

                        encryptionResults[column].push({ value, encryptionTime: encryptionTime.toFixed(3), sizeKB: encryptedSizeKB.toFixed(3) });
                    }
                }

                for (const column of columns) {
                    const csvHeader = 'value,EncryptionTime(ms),EncryptedSize(KB)\n';
                    const csvRows = encryptionResults[column].map(row => `${row.value},${row.encryptionTime},${row.sizeKB}`).join('\n');
                    fs.writeFileSync(`${column}_encryption_times.csv`, csvHeader + csvRows);
                    console.log(`Encryption times saved to ${column}_encryption_times.csv.`);
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

main();