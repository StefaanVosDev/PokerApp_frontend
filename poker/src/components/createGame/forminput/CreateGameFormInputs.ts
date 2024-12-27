import Configuration from "../../../model/Configuration.ts";

export interface CreateGameFormInputs {
    name: string;
    maxPlayers: number;
    settings: Configuration;
}