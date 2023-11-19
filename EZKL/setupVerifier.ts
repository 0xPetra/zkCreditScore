import { executeCommand, checkFileExists } from './utils';

// Main function to execute all commands and check files
async function main() {

    try {
        // Execute commands
        await executeCommand('ezkl gen-settings -M network.onnx');
        await executeCommand('ezkl calibrate-settings -M network.onnx -D input.json --target resources');
        await executeCommand('ezkl get-srs -S settings.json');
        await executeCommand('ezkl compile-circuit -M network.onnx -S settings.json --compiled-circuit network.ezkl');
        await executeCommand('ezkl setup -M network.ezkl --srs-path=kzg.srs --vk-path=vk.key --pk-path=pk.key');
        await executeCommand('ezkl create-evm-verifier --srs-path kzg.srs --settings-path settings.json --vk-path vk.key --sol-code-path Verifier.sol --abi-path Verifier.abi');
        await executeCommand('solc --abi Verifier.sol -o build --overwrite');

        // Check if files were created
        Promise.all([
            await checkFileExists('settings.json'),
            await checkFileExists('network.ezkl'),
            await checkFileExists('kzg.srs'),
            await checkFileExists('vk.key'),
            await checkFileExists('pk.key'),
            await checkFileExists('Verifier.sol'),
            await checkFileExists('build/Halo2Verifier.abi')
        ]).then(() => {
            console.log('Files generetad successfuly:\n  settings.json\n  network.ezkl\n  kzg.srs\n  vk.key\n  pk.key\n  Verifier.sol\n  build/Halo2Verifier.abi')
        });

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

main();
