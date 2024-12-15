import {useQuery} from '@tanstack/react-query';
import {getGames} from "../services/dataService.ts";

export function useGames() {
    const {isLoading, isError, data: games} = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
        refetchInterval: 1000
    });

    return {
        isLoading,
        isError,
        games,
    };
}