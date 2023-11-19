import { google, Auth } from 'googleapis';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID: string | undefined = process.env.CLIENT_ID;
const CLIENT_SECRET: string | undefined = process.env.CLIENT_SECRET;
const REDIRECT_URI: string | undefined = process.env.REDIRECT_URI;
const REFRESH_TOKEN: string | undefined = process.env.REFRESH_TOKEN;

async function main(): Promise<void> {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
        console.log("Missing required environment variables.");
        await returnModelProofIfExists();
        return;
    }

    const oauth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });

    // Function to execute your Colab script
    async function executeColabScript(fileId: string): Promise<void> {
        // This should be plugged to Google Colab in case we want to use it.
    }

    // Replace with your actual file ID
    const COLAB_FILE_ID: string = 'YOUR_COLAB_FILE_ID';

    try {
        await executeColabScript(COLAB_FILE_ID);
        console.log('Script executed');
    } catch (error) {
        console.error(error);
    }
}

async function returnModelProofIfExists(): Promise<string | null> {
    const modelProofPath = path.join(__dirname, 'model.proof');
    try {
        await fs.promises.access(modelProofPath);
        console.log("model.proof exists. Reading file...");
        const fileContents = await fs.promises.readFile(modelProofPath, 'utf8');
        const contentsObject = JSON.parse(fileContents);
        // console.log(JSON.parse(fileContents).proof);
        // console.log(JSON.parse(fileContents).instances);
        return fileContents;
    } catch (error) {
        console.log("model.proof does not exist or cannot be read.");
        return null;
    }
}

main();

// ezkl print-proof-hex --proof-path model.proof