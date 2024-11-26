import PokerTableSimple from "../pokertable/PokerTableSimple.tsx";
import {useGame} from "../../hooks/useGame.ts";
import {usePlayersHand} from "../../hooks/usePlayersHand.ts";
import Card from "../../model/Card.ts";
import {Alert, Button} from "@mui/material";
import {useParams} from "react-router-dom";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {useState} from "react";
import {useProcessMove} from "../../hooks/useProcessMove.ts";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";

// Helper function to map card suits and ranks to image paths
function mapCardToImage(card: Card): string {


    const SuitLabels: Record<string, string> = {
        SPADES: "spades",
        CLUBS: "clubs",
        HEARTS: "hearts",
        DIAMONDS: "diamonds",
    };

    return `/images/${SuitLabels[card.suit]}_${card.rank}.png`;
}

function Game() {

    const { id: gameId } = useParams<{ id: string }>();
    // gameId = "7fabf988-a888-4dc6-8423-4cd9f620ff00";
    const {isLoading, isError, communityCards} = useCommunityCards(String(gameId));
    const {isLoadingTurn, isErrorLoadingTurn, turnId} = useCurrentTurn(String(gameId));
    const [moveMade, setMoveMade] = useState<string | null>(null);
    const {isProcessingMove, isErrorProcessingMove, processMove} = useProcessMove(turnId?.content, moveMade, String(gameId));


    // Fetch the game data
    const {isLoading: gameLoading, isError: gameError, game} = useGame(String(gameId));


    // Extract player IDs from the game
    const playerIds = game?.players.map((player) => player.id) || [];

    // Fetch player hands based on their IDs
    const {isLoading: handsLoading, isError: handsError, playersHand} = usePlayersHand(playerIds);

    if (isLoading) return <Loader>loading cards</Loader>
    if (isError || !communityCards || communityCards.length === 0) return <Alert severity="error">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || !turnId) return <Alert severity="error">Error loading turn</Alert>
    if (isProcessingMove) return <Loader>registering move</Loader>
    if (isErrorProcessingMove || !processMove) return <Alert severity="error">Error registering move</Alert>

    function handleCheck() {
        setMoveMade("CHECK");
        processMove()
    }



    if (gameLoading || handsLoading) {
        return <p>Loading...</p>;
    }

    if (gameError || handsError || !game || !playersHand) {
        return <p>Error loading game data.</p>;
    }

    // Map each player's cards
    const playersWithCards = game.players.map((player) => ({
        ...player,
        cards: (playersHand[player.id] || []).map(mapCardToImage), // Map cards to images
    }));

    return (
        <>
            <PokerTableSimple
                players={playersWithCards}
                communityCards={communityCards}
            />
            <div className="check-button">
                <Button variant="contained" color="secondary" onClick={handleCheck}>Check</Button>
            </div>
        </>
    )
        ;
}

export default Game;
