import { monsters } from "./entities/monsters";

export const zones = {
    softgrass_field: {
        id: "softgrass_field",
        displayName: "Softgrass Field",
        boss: monsters["slime"],
        monsters: [monsters["slime"], monsters["rabbit"]],
    },
    hollow_thicket: {
        id: "hollow_thicket",
        displayName: "Hollow Ticket",
        boss: monsters["wolf"],
        monsters: [monsters["wolf"], monsters["snake"]],
    },
    ashen_spire: {
        id: "ashen_spire",
        displayName: "Ashen Spire",
        boss: monsters["dragon"],
        monsters: [monsters["golem"]],
    }
}
