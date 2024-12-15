import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Alert, Button } from "@mui/material";
import { useGames } from "../../hooks/useGames.ts";
import Loader from "../loader/Loader.tsx";
import { useCreateNewRound } from "../../hooks/useCreateNewRound.ts";
import { useState, useEffect } from "react";
import { getStatusColor } from "./gameStatusUtils";
import './GameList.scss';

export default function GameList() {
    const navigate = useNavigate();
    const { isLoading, isError, games } = useGames();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const { triggerNewRound, isPending, isError: isRoundError, isSuccess } = useCreateNewRound(selectedGameId);

    const [currentPage, setCurrentPage] = useState(0);
    const gamesPerPage = 3;

    useEffect(() => {
        if (isSuccess && selectedGameId) {
            navigate(`/game/${selectedGameId}`);
        }
    }, [isSuccess, selectedGameId, navigate]);

    if (isLoading) return <Loader>Loading games...</Loader>;
    if (isError) return <Alert severity="error">Error loading games</Alert>;

    const handleGameClick = (gameId: string) => {
        setSelectedGameId(gameId);
        triggerNewRound();
    };

    const totalPages = Math.ceil((Array.isArray(games) ? games.length : 0) / gamesPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const displayedGames = Array.isArray(games)
        ? games.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage)
        : [];

    const handleCreateGame = () => {
        navigate('/create-game');
    };

    return (
        <div className="game-list-container">
            <Button
                className="create-game-button"
                variant="contained"
                onClick={handleCreateGame}
            >
                Create Game
            </Button>

            <Button
                className="back-button"
                variant="contained"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Typography variant="h4" component="h1" className="title">
                Available Games
            </Typography>
            {isPending && <Loader>Initializing new round...</Loader>}
            {isRoundError && <Alert severity="error">Error initializing new round</Alert>}

            <div className="game-list">
                {displayedGames.length === 0 ? (
                    <Alert severity="info">No games available</Alert>
                ) : (
                    displayedGames.map((game) => {
                        const currentPlayers = game.players.length;
                        const statusColor = getStatusColor(game.status);

                        return (
                            <Card
                                className="game-card"
                                key={game.id}
                                onClick={() => handleGameClick(game.id)}
                                style={{ borderLeft: `5px solid ${statusColor}` }} // Add color to the card's left border
                            >
                                <CardContent>
                                    <Typography variant="h6" className="game-title">
                                        {game.name}
                                    </Typography>
                                    <Typography variant="body2" className="game-players">
                                        Players: {currentPlayers}/{game.maxPlayers}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="game-status"
                                        style={{ color: statusColor }}
                                    >
                                        {game.status === 'FINISHED' && game.players.some(player => player.isWinner)
                                            ? `Status: ${game.status}, Winner: ${game.players.find(player => player.isWinner)?.username}`
                                            : `Status: ${game.status}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            <div className="pagination-controls">
                {currentPage !== 0 && (
                    <Button
                        variant="contained"
                        onClick={handlePrevPage}
                    >
                        Previous
                    </Button>
                )}
                <Typography variant="body1" className="pagination-info">
                    Page {currentPage + 1} of {totalPages}
                </Typography>
                {currentPage !== totalPages - 1 && (
                    <Button
                        variant="contained"
                        onClick={handleNextPage}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
