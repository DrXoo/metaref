const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME;
const numberPendingGames = process.env.NUM_PENDING_GAMES;

async function tryGetGameName(gameId) {
    try {
        const response = await client.getItem( {
            TableName: tableName,
            Key: {
                'pk': { S: 'Games' },
                'sk': { S: gameId },
            }
        });

        if(!response.Item) {
            return undefined;
        }

        return response.Item['RawGameName'].S
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function createGame(gameId, gameName, createdOn) {
    try {
        await client.putItem({
            TableName: tableName,
            Item: {
                'pk': { S: 'Games' },
                'sk': { S: gameId },
                'RawGameName': { S: gameName},
                'GameName': { S: normalizeGameNameText(gameName) },
                'CreatedOn' : { S: createdOn }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function assignUser(gameId, userName) {
    try {
        await client.putItem({
            TableName: tableName,
            Item: {
                'pk': { S: 'UserGame' },
                'sk': { S: `${gameId}_${userName}` }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function deletePendingGame(url) {
    try {
        await client.deleteItem({
            TableName: tableName,
            Key: {
                pk: { S: 'Pending' },
                sk: { S: url}
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function getPendingGames() {
    const params = {
        TableName: tableName, 
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
        ':pk': { S: 'Pending' },
        },
        ProjectionExpression: 'GameId, GameUrl, UserName, CreatedOn',
        ScanIndexForward: true, // Order by CreatedOn in ascending order
        Limit: Number.parseInt(numberPendingGames), // Take X elements only
    };

    try {
        const response = await client.query(params);

        if(!response.Items) {
            return [];
        } 

        if(response.Items.length === 0) {
            return [];
        }

        return response.Items.map(x => {
            return {
                gameId: x['GameId'].S,
                userName: x['UserName'].S,
                url: x['GameUrl'].S,
                createdOn: x['CreatedOn'].S
            }
        })
    } catch (error) {
        console.error('Error querying DynamoDB:', error);
    }
}

function normalizeGameNameText(rawText) {
    return rawText.trim().toLowerCase().replace(/\s/g, '');
}

module.exports = { createGame, assignUser, getPendingGames, deletePendingGame, tryGetGameName };