import {useNavigate} from "react-router-dom";
import {Alert, Button, Typography} from "@mui/material";
import Loader from "../loader/Loader.tsx";
import {useEffect, useState} from "react";
import './GameList.scss';
import {useGames} from "../../hooks/useGame.ts";
import {GameCard} from "./GameCard.tsx";

export default function GameList() {
    const navigate = useNavigate();
    const {isLoading, isError, games} = useGames();
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(0);
    const gamesPerPage = 3;

    useEffect(() => {
        if (selectedGameId) {
            navigate(`/game/${selectedGameId}`);
        }
    }, [selectedGameId, navigate]);

    if (isLoading) return <Loader>Loading games...</Loader>;
    if (isError) return <Alert severity="error">Error loading games</Alert>;


    const handleGameClick = (gameId: string) => {
        setSelectedGameId(gameId);
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
                onClick={() => navigate("/")}
            >
                Back
            </Button>

            <Typography variant="h4" component="h1" className="title">
                Available Games
            </Typography>

            <div className="game-list">
                {displayedGames.length === 0 ? (
                    <Alert severity="info">No games available</Alert>
                ) : (
                    displayedGames.map((game) => {
                        return (
                            <GameCard key={game.id} onClick={() => handleGameClick(game.id)} game={game}/>
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
