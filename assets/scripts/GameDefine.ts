import PlayerAnim from "./PlayerAnim";

export class PlayerData {
    id: string;
    key: string;
    type: string;
    x: number;
    dir: number;
    status: string;
    message?: string;
}

export class RivalData {
    data: PlayerData;
    anim: PlayerAnim;
}

export class SocketData {
    key: string;
    data: PlayerData;
}

export const CONNECTED = 'connected';
export const INGAME = 'ingame';