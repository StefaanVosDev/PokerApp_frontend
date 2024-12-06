import PokerTableSimple from "../pokertable/PokerTableSimple.tsx";
import {useGame} from "../../hooks/useGame.ts";
import {usePlayersHand} from "../../hooks/usePlayersHand.ts";
import Card from "../../model/Card.ts";
import {Alert, Button} from "@mui/material";
import {useParams} from "react-router-dom";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {useEffect, useState} from "react";
import {useProcessMove} from "../../hooks/useProcessMove.ts";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";
import {useCurrentRound} from "../../hooks/useCurrentRound.ts";
import {useTurns} from "../../hooks/useTurns.ts";
import {useDividePot} from "../../hooks/useDividePot.ts";

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
    const {isLoadingRound, isErrorLoadingRound, round, refetch} = useCurrentRound(String(gameId));
    const {isLoading: gameLoading, isError: gameError, game, refetchGame} = useGame(String(gameId));
    const playerIds = game ? game.players.map((player) => player.id) : [];
    const {isLoading: handsLoading, isError: handsError, playersHand, refetch: refetchHands} = usePlayersHand(playerIds);
    const roundId = round ? round.id : "";
    const {isProcessingMove, isErrorProcessingMove, processMove, isSuccessProcessingMove} = useProcessMove(turnId?.content, String(gameId), String(roundId));
    const {isLoadingTurns, isErrorLoadingTurns, turns, refetchTurns} = useTurns(roundId);
    const [shouldShowCheckButton, setShouldShowCheckButton] = useState(false);
    const [amountToCall, setAmountToCall] = useState(0);
    const [currentPlayerMoney, setCurrentPlayerMoney] = useState(1000);
    const {isDividingPot, isErrorDividingPot, triggerDividePot} = useDividePot(round?.id, String(gameId));

    useEffect(() => {
        if (isSuccessProcessingMove) {
            refetchTurns();
        }
    }, [isSuccessProcessingMove, refetchTurns]);

    useEffect(() => {
        refetch();
        if (turns) {
            const currentPlayer = turns.find(turn => turn.moveMade.toString() === "ON_MOVE")?.player;
            setCurrentPlayerMoney(currentPlayer?.money || 0);
        }
    }, [currentPlayerMoney, refetch, turns]);

    useEffect(() => {
        if (!turns || !round) return;

        refetchGame()
        const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
        const lastBet = currentPhaseTurns.reduce((max, turn) => Math.max(max, turn.moneyGambled), 0);

        const currentTurn = turns.find(turn => turn.moveMade.toString() === "ON_MOVE");
        if (currentTurn) {
            const totalGambled = currentPhaseTurns
                .filter(turn => turn.player.id === currentTurn.player.id)
                .reduce((sum, turn) => sum + turn.moneyGambled, 0);

            setShouldShowCheckButton(totalGambled === lastBet);
            setAmountToCall(lastBet - totalGambled);
        }
    }, [turns, round, refetchGame]);

    useEffect(() => {
        if (round && round.phase === "FINISHED") {
            triggerDividePot()
        }
    }, [round, triggerDividePot]);


    if (isLoading) return <Loader>loading cards</Loader>
    if (isError || !communityCards) return <Alert severity="error" variant="filled">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || !turnId) return <Alert severity="error" variant="filled">Error loading turn</Alert>
    if (isProcessingMove) return <Loader>registering move</Loader>
    if (isErrorProcessingMove || !processMove) return <Alert severity="error" variant="filled">Error registering move</Alert>
    if (isLoadingRound) return <Loader>Loading current round...</Loader>
    if (isErrorLoadingRound) return <Alert severity="error" variant="filled">Error Loading current round</Alert>
    if (gameLoading) return <Loader>Loading game...</Loader>;
    if (gameError || !game) return <Alert severity="error" variant="filled">Error loading game data</Alert>;
    if (handsLoading) return <Loader>Loading hands...</Loader>;
    if (handsError || !playersHand) return <Alert severity="error" variant="filled">Error loading hands</Alert>;
    if (isLoadingTurns) return <Loader>Loading turns...</Loader>;
    if (isErrorLoadingTurns || !turns) return <Alert severity="error" variant="filled">Error loading turns</Alert>;
    if (isDividingPot) return <Loader>Splitting winnings...</Loader>
    if (isErrorDividingPot) return <Alert severity="error" variant="filled">Error splitting winnings</Alert>

    async function handleCheck() {
        await refetch();
        await refetchHands();
        processMove({moveMade: "CHECK"})
    }

    async function handleFold() {
        await refetch();
        await refetchHands();
        processMove({moveMade: "FOLD"})
    }

    async function handleCall(amount: number) {
        await refetch();
        await refetchHands();
        processMove({moveMade: "CALL", amount: amount})
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
                turns={turns.filter(turn => turn.madeInPhase == round!.phase || turn.moveMade.toString() === "FOLD")}
                dealerIndex={round ? round.dealerIndex : 0}
            />
            <div className="buttons-container">
                <Button className="fold-button" variant="contained" color="secondary"
                        onClick={async () => await handleFold()}>Fold</Button>
                {shouldShowCheckButton ? (
                    <Button variant="contained" color="secondary"
                            onClick={async () => await handleCheck()}>Check</Button>
                ) : (
                    <Button variant="contained" color="secondary"
                            onClick={async () => await handleCall(amountToCall)}>Call ${amountToCall}</Button>
                )}
            </div>
        </>

    );

}

export default Game;