import PokerTableSimple from "../pokertable/PokerTableSimple.tsx";
import {useGame} from "../../hooks/useGame.ts";
import {usePlayersHand} from "../../hooks/usePlayersHand.ts";
import Card from "../../model/Card.ts";
import {Alert, Button} from "@mui/material";
import {useParams} from "react-router-dom";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {useEffect} from "react";
import {useProcessMove} from "../../hooks/useProcessMoveTest.ts";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";
import {useCurrentRound} from "../../hooks/useCurrentRound.ts";
import {useTurns} from "../../hooks/useTurns.ts";
import {Round} from "../../model/Round.ts";

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

    const {isLoading, isError, communityCards} = useCommunityCards(String(gameId));
    const {isLoadingTurn, isErrorLoadingTurn, turnId} = useCurrentTurn(String(gameId));
    const {isLoadingRound, isErrorLoadingRound, round, refetch} = useCurrentRound<Round | null>(String(gameId));
    const {isLoading: gameLoading, isError: gameError, game} = useGame(String(gameId));
    const playerIds = game?.players.map((player) => player.id) || [];
    const {isLoading: handsLoading, isError: handsError, playersHand, refetch: refetchHands} = usePlayersHand(playerIds);
    const roundId = round?.id;
    const {isProcessingMove, isErrorProcessingMove, processMove, isSuccessProcessingMove} = useProcessMove(turnId?.content, String(gameId), String(roundId));
    const {isLoadingTurns, isErrorLoadingTurns, turns, refetchTurns} = useTurns(roundId);

    useEffect(() => {
        if (isSuccessProcessingMove) {
            refetchTurns();
        }
    }, [isSuccessProcessingMove, refetchTurns]);

    useEffect(() => {
        refetch();
    }, [refetch, turns]);

    if (isLoading) return <Loader>loading cards</Loader>
    if (isError || !communityCards) return <Alert severity="error">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || !turnId) return <Alert severity="error">Error loading turn</Alert>
    if (isProcessingMove) return <Loader>registering move</Loader>
    if (isErrorProcessingMove || !processMove) return <Alert severity="error">Error registering move</Alert>
    if (isLoadingRound) return <Loader>Loading current round...</Loader>
    if (isErrorLoadingRound) return <Alert severity="error">Error Loading current round</Alert>
    if (gameLoading) return <Loader>Loading game...</Loader>;
    if (gameError || !game) return <Alert severity="error">Error loading game data</Alert>;
    if (handsLoading) return <Loader>Loading hands...</Loader>;
    if (handsError || !playersHand) return <Alert severity="error">Error loading hands</Alert>;
    if (isLoadingTurns) return <Loader>Loading turns...</Loader>;
    if (isErrorLoadingTurns || !turns) return <Alert severity="error">Error loading turns</Alert>;

    async function handleCheck() {
        await refetch();
        await refetchHands();
        processMove("CHECK")
    }

    async function handleFold() {
        await refetch();
        await refetchHands();
        processMove("FOLD")
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
                turns={turns.filter(turn => turn.madeInPhase == round!.phase || turn.type === "FOLD")}
            />
            <div className="check-button">
                <Button variant="contained" color="secondary" onClick={async () => await handleCheck()}>Check</Button>
            </div>
            <div className="fold-button">
                <Button variant="contained" color="secondary" onClick={async () => await handleFold()}>Fold</Button>
            </div>
        </>
    );
}

export default Game;