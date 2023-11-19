import { executeCommand, checkFileExists } from './utils';

// Main function to execute all commands and check files
async function main() {

    try {
        // Execute commands
        if(
            (await checkFileExists('input.json')) &&
            (await checkFileExists('network.ezkl'))
        ) {
            await executeCommand('ezkl gen-witness -D input.json -M network.ezkl');
        }
        if(
            (await checkFileExists('witness.json')) &&
            (await checkFileExists('kzg.srs'))
        ) {
            await executeCommand('ezkl prove -M network.ezkl --witness witness.json --pk-path=pk.key --proof-path=model.proof --srs-path=kzg.srs');
        }

        Promise.all([
            await checkFileExists('witness.json'),
            await checkFileExists('model.proof'),
        ]).then(() => {
            console.log('Files generetad successfuly:\n  witness.json\n  model.proof')
        });

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

main();
