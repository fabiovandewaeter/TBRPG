export interface GameState {
    currentTab: 'village' | 'combat';
    resources: {
        gold: number;
        wood: number;
        iron: number;
    };
    buildings: Building[];
    player: PlayerStats;
}

interface Building {
    id: string;
    type: 'farm' | 'mine' | 'barracks';
    level: number;
}

interface PlayerStats {
    health: number;
    attack: number;
    defense: number;
}

interface CombatLog {
    text: string;
    timestamp: number;
}
