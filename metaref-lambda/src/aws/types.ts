export interface Game {
    gameId: string;
    gameName: string;
}
  
export interface User {
    userId: string;
}

export interface GameUsers {
    gameId: string;
    users: string[];
}