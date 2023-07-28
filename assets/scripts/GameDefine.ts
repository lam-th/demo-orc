export class PlayerData {
    id: string;
    key: string;
    type: string;
    x: number;
    dir: number;
    order: number;
    node: cc.Node;
}

export class SocketData {
    key: string;
    data: PlayerData;
}

export const CONNECTED = 'connected';
export const INGAME = 'ingame';