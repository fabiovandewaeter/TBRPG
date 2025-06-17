import { weapons } from "./weapons";
import { zones } from "./zones";

const ICON = "🏰";

export const getDungeonList = () => {
    const baseDungeons = [
        {
            zone: zones["softgrass_field"],
            baseInterval: 1000,
            loot: [weapons["sword"]],
        },
        {
            zone: zones["hollow_thicket"],
            baseInterval: 3000,
            loot: [weapons["sword"]],
        }
    ];

    return baseDungeons.map(dungeon => ({
        ...dungeon,
        id: dungeon.zone.id,
        displayName: dungeon.zone.displayName,
        icon: ICON,
        boss: dungeon.zone.boss,
    }));
};
