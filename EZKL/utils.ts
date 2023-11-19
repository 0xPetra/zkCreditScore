import { exec } from 'child_process';
import { promises as fs } from 'fs';

// Function to execute a command without logging its output
export function executeCommand(command: string): Promise<void> {
    console.log(`${command}`);
    return new Promise((resolve, reject) => {
        exec(command, (error) => {
            if (error) {
                // Check if the error is an expected one, adjust as needed
                if (error.message.includes("could not find contract")) {
                    // console.log(`Expected error occurred: ${error.message}`);
                    resolve(); // Continue execution for expected error
                } else {
                    reject(`Error: ${error.message}`);
                }
                return;
            }
            resolve();
        });
    });
}

// Function to check if a file exists
export async function checkFileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        // console.log(`${filePath}`);
        return true
    } catch {
        throw new Error(`File does not exist: ${filePath}`);
    }
}
