export function parseDeviceLink(link: string) : string | undefined {
    const segments = new URL(link).pathname.split('/');
    return segments[segments.length - 1];
}

export function parseAppLink(link: string) :  { userName: string | undefined, appId: string | undefined } {
    // Define a regular expression to match the desired values
    const regex = /\/appreferrals\/([^\/]+)\/([^\/]+)\/\?/;

    // Use the regular expression to match the values in the URL
    const match = link.match(regex);

    // Extract the values from the match
    const userName = match ? match[1] : undefined;
    const appId = match ? match[2] : undefined;

    return { userName, appId };
}