export interface Game {
    gameId: string;
    gameName: string;
    rawGameName: string;
}
  
export interface User {
    userName: string;
}

export interface GameUsers {
    gameId: string;
    users: string[];
}

export interface GameUser { 
    gameId: string;
    userName: string
}