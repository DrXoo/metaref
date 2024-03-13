import { GameUser } from "../aws/types";

const deviceReferralTemplate: string = "https://www.meta.com/referrals/link/";
const appReferralTemplate: string = "https://www.oculus.com/appreferrals/USER/APP"

export function buildAppUrl(userId: string, appId: string) : string{
    return appReferralTemplate.replace('USER',userId).replace('APP', appId);
}

export function buildDeviceUrl(userId: string) : string {
    return `${deviceReferralTemplate}${userId}`;
}

export function normalizeGameNameText(rawText: string) : string{
    return rawText.trim().toLowerCase().replace(/\s/g, '');
}

export function parseDeviceLink(link: string) : string | undefined {
    if(!link.includes('referrals/link')) {
        return undefined;
    }
    
    if(!URL.canParse(link)) {
        return undefined;
    }
    
    const segments = new URL(link).pathname.split('/');
    return segments[segments.length - 1];
}

export function parseGameLink(link: string) :  GameUser {
    // Define a regular expression to match the desired values
    const regex = /\/appreferrals\/([^\/]+)\/([^\/]+)\/\?/;

    // Use the regular expression to match the values in the URL
    const match = link.match(regex);

    // Extract the values from the match
    const userName = match ? match[1] : undefined;
    const gameId = match ? match[2] : '';

    return { userName: userName!, gameId: normalizeGameNameText(gameId) };
}
