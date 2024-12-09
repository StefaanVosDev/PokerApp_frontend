import { createGame } from "../services/dataService";
import { useMutation } from "@tanstack/react-query";
import { CreateGameFormInputs } from "../components/game/forminput/CreateGameFormInputs";

export function useCreateGame() {
    return useMutation<CreateGameFormInputs, Error, CreateGameFormInputs>({
        mutationFn: createGame,
    });
}
