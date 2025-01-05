import {useNavigate} from "react-router-dom";
import {Alert, Box, Button, Typography} from "@mui/material";
import Loader from "../loader/Loader.tsx";
import {useEffect, useState} from "react";
import {useGames} from "../../hooks/useGame.ts";
import {GameCard} from "../game/GameCard.tsx";
import {calculateTotalPages, filterDisplayedGames} from "../../services/gameListHelperService/gameListHelperService.ts";
import GameFilterForm from "./GameFilterForm";
import {Game} from "../../model/Game";

export default function GameList() {
    const navigate = useNavigate();
    const {isLoading, isError, games} = useGames();
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const gamesPerPage = 3;

    useEffect(() => {
        if (selectedGameId) {
            navigate(`/game/${selectedGameId}`);
        }
    }, [selectedGameId, navigate]);

    useEffect(() => {
        if (Array.isArray(games)) {
            setFilteredGames(games);
        }
    }, [games]);

    if (isLoading) return <Loader>Loading games...</Loader>;
    if (isError) return <Alert severity="error">Error loading games</Alert>;

    const handleGameClick = (gameId: string) => {
        setSelectedGameId(gameId);
    };

    const totalPages = calculateTotalPages(games, gamesPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const displayedGames = filterDisplayedGames(games, gamesPerPage, currentPage)

    const handleCreateGame = () => {
        navigate('/create-game');
    };

    const onFilteredGames = (games: Game[], reset: boolean = false) => {
        if (reset) {
            setFilteredGames(games);
            setCurrentPage(0);
        } else {
            setFilteredGames(games);
        }
    };

    const resetPage = () => {
        setCurrentPage(0);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: 'black',
            color: 'white',
            fontFamily: 'Kalam, sans-serif',
        }}>
            <GameFilterForm games={games || []} onFilteredGames={onFilteredGames} resetPage={resetPage}  />

            <Button
                sx={{
                    position: 'absolute',
                    top: '7.5rem',
                    left: '3rem',
                    zIndex: 10,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontFamily: 'Kalam, sans-serif',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#45a049',
                    }
                }}
                variant="contained"
                onClick={handleCreateGame}
            >
                Create Game
            </Button>

            <Button
                sx={{
                    position: 'absolute',
                    top: '11.5rem',
                    left: '3rem',
                    zIndex: 10,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontFamily: 'Kalam, sans-serif',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#45a049',
                    }
                }}
                variant="contained"
                onClick={() => navigate("/")}
            >
                Back
            </Button>

            <Typography sx={{
                paddingTop: '4rem',
                fontSize: '2.5rem',
                marginBottom: '2rem',
                fontFamily: 'Kalam, sans-serif',
            }} component="h1">
                Available Games
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                maxWidth: '600px',
                fontFamily: 'Kalam, sans-serif',
            }}>
                {displayedGames.length === 0 ? (
                    <Alert severity="info">No games available</Alert>
                ) : (
                    displayedGames.map((game) => (
                        <GameCard key={game.id} onClick={() => handleGameClick(game.id)} game={game} />
                    ))
                )}
            </Box>

            {filteredGames.length > gamesPerPage && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '2rem',
                        fontFamily: 'Kalam, sans-serif',
                        '& button': {
                            backgroundColor: '#1e1e1e',
                            color: 'white',
                            margin: '0 1rem',
                            padding: '0.5rem 1rem',
                            fontFamily: 'Kalam, sans-serif',
                        },
                    }}
                >
                    {currentPage !== 0 && (
                        <Button variant="contained" onClick={handlePrevPage}>
                            Previous
                        </Button>
                    )}
                    <Typography
                        sx={{
                            margin: '0 1rem',
                            fontFamily: 'Kalam, sans-serif',
                        }}
                        variant="body1"
                    >
                        Page {currentPage + 1} of {totalPages}
                    </Typography>
                    {currentPage !== totalPages - 1 && (
                        <Button variant="contained" onClick={handleNextPage}>
                            Next
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
