import { useQuery } from '@tanstack/react-query';
import { getGames } from "../services/dataService.ts";

export function useGames() {
    const { isLoading, isError, data: games } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    return {
        isLoading,
        isError,
        games,
    };
}