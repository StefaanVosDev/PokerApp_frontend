import { useQuery } from '@tanstack/react-query';
import { getGames } from "../services/dataService.ts";
import {useEffect} from "react";

export function useGames() {
    const { isLoading, isError, data: games } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    useEffect(() => {
        console.log("Fetched games in useGames hook:", games);
    }, [games]);

    return {
        isLoading,
        isError,
        games,
    };
}