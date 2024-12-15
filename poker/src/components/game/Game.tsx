import PokerTable from "../pokertable/PokerTable.tsx";
import {useGame} from "../../hooks/useGame.ts";
import {usePlayersHand} from "../../hooks/usePlayersHand.ts";
import {Alert} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useEffect, useState} from "react";
import {useProcessMove} from "../../hooks/useProcessMove.ts";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";
import {useCurrentRound} from "../../hooks/useCurrentRound.ts";
import {useTurns} from "../../hooks/useTurns.ts";
import {useDividePot} from "../../hooks/useDividePot.ts";
import {useCreateNewRoundIfFinished} from "../../hooks/useCreateNewRoundIfFinished.ts";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {calculateCurrentTurnDetails, calculateLastBet, getMinimumRaise} from "../../services/turnService.ts";
import {mapCardToImage} from "../../services/mapToCardService.ts";
import ActionButtons from "../actionButtons/ActionButtons.tsx";

function Game() {
    const {id: gameId} = useParams<{ id: string }>();

    const navigate = useNavigate();
    const [isEndOfRound, setIsEndOfRound] = useState(false);
    const [isHandlingProcessMove, setIsHandlingProcessMove] = useState(false);

    const {isLoading, isError, communityCards} = useCommunityCards(String(gameId));
    const {isLoadingTurn, isErrorLoadingTurn, turnId} = useCurrentTurn(String(gameId), isEndOfRound, isHandlingProcessMove);
    const {isLoadingRound, isErrorLoadingRound, round} = useCurrentRound(String(gameId), isEndOfRound);
    const {isLoading: gameLoading, isError: gameError, game} = useGame(String(gameId));
    const playerIds = game ? game.players.map((player) => player.id) : [];
    const {isLoading: handsLoading, isError: handsError, playersHand} = usePlayersHand(playerIds, isEndOfRound);
    const roundId = round ? round.id : "";
    const {
        isProcessingMove,
        isErrorProcessingMove,
        processMove,
        isSuccessProcessingMove
    } = useProcessMove(turnId?.content, String(gameId), String(roundId));
    const {isLoadingTurns, isErrorLoadingTurns, turns} = useTurns(roundId);
    const [shouldShowCheckButton, setShouldShowCheckButton] = useState(false);
    const [amountToCall, setAmountToCall] = useState(0);
    const [currentPlayerMoney, setCurrentPlayerMoney] = useState(1000);
    const [lastBet, setLastBet] = useState(0);
    const [raiseAmount, setRaiseAmount] = useState(0);
    const [showRaiseOptions, setShowRaiseOptions] = useState(false);
    const {
        isPending: isLoadingCreateNewRoundIfFinished,
        isError: isErrorCreateNewRoundIfFinished,
        triggerNewRound,
        isSuccessCreatingNewRound
    } = useCreateNewRoundIfFinished(String(gameId), roundId);
    const {
        isDividingPot,
        isErrorDividingPot,
        triggerDividePot,
        isSuccessDividingPot
    } = useDividePot(roundId);
    const [totalMoneyInPot, setTotalMoneyInPot] = useState(0);
    //const {isLoading: isLoadingOnMove, isError: isErrorOnMove, isOnMove} = useIsOnMove(gameId);
    const [isRoundBeingCreated, setIsRoundBeingCreated] = useState(false);

    useEffect(() => {
        if (isSuccessProcessingMove) {
            setShowRaiseOptions(false);
            setIsHandlingProcessMove(false)
        }
        if (turns) {
            const currentPlayer = turns.find(turn => turn.moveMade.toString() === "ON_MOVE")?.player;
            setCurrentPlayerMoney(currentPlayer ? currentPlayer.money : 0);
            setTotalMoneyInPot(turns.reduce((sum, turn) => sum + turn.moneyGambled, 0));
        }
    }, [isSuccessProcessingMove, turns]);

    useEffect(() => {
        if (!turns || !round || !game) return;

        const lastBet = calculateLastBet(turns, round);
        setLastBet(lastBet);

        const {shouldShowCheckButton, amountToCall, raiseAmount} = calculateCurrentTurnDetails(turns, round, lastBet, game.settings.bigBlind);
        setShouldShowCheckButton(shouldShowCheckButton);
        setAmountToCall(amountToCall);
        setRaiseAmount(raiseAmount);
    }, [turns, round]);


    useEffect(() => {
        if (round && round.phase === "FINISHED") {
            setIsEndOfRound(true);
            triggerDividePot()
        }
    }, [round?.phase]);

    useEffect(() => {
        if (isSuccessDividingPot && !isRoundBeingCreated) {
            if (game && game.players.length === 1) {
                const winner = game.players[0]
                navigate(`/end-game/${winner.id}`)
            } else {
                triggerNewRound()
                setIsRoundBeingCreated(true)
            }
        }
    }, [isSuccessDividingPot]);

    useEffect(() => {
        if (isSuccessCreatingNewRound) {
            setIsEndOfRound(false);
            setIsRoundBeingCreated(false);
        } else if (isErrorCreateNewRoundIfFinished) {
            setIsRoundBeingCreated(false);
        }
    }, [isSuccessCreatingNewRound, isErrorCreateNewRoundIfFinished]);

    if (isLoading) return <Loader>loading cards</Loader>
    if (isError || !communityCards) return <Alert severity="error" variant="filled">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || (!turnId && round?.phase !== "FINISHED"))
        return <Alert severity="error" variant="filled">Error loading turn</Alert>
    if (isProcessingMove) return <Loader>registering move</Loader>
    if (isErrorProcessingMove || !processMove)
        return <Alert severity="error" variant="filled">Error registering move</Alert>
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
    if (isLoadingCreateNewRoundIfFinished) return <Loader>Starting new round...</Loader>
    if (isErrorCreateNewRoundIfFinished)
        return <Alert severity="error" variant="filled">Error starting new round</Alert>
    if (isErrorDividingPot) return <Alert severity="error" variant="filled">Error splitting winnings</Alert>


    // Map each player's cards
    const playersWithCards = game.players.map((player) => ({
        ...player,
        cards: (playersHand[player.id] || []).map(mapCardToImage), // Map cards to images
    }));

    return (
        <>
            <PokerTable
                players={playersWithCards}
                communityCards={communityCards}
                turns={turns.filter(turn => turn.madeInPhase == round!.phase || turn.moveMade.toString() === "FOLD")}
                dealerIndex={round ? round.dealerIndex : 0}
                maxPlayers={game.maxPlayers}
                gameId={gameId ? gameId : ""}
            />
            <div className="pot-money">
                Pot ${totalMoneyInPot}
            </div>
            {!isEndOfRound &&
                <ActionButtons
                    shouldShowCheckButton={shouldShowCheckButton}
                    amountToCall={amountToCall}
                    currentPlayerMoney={currentPlayerMoney}
                    showRaiseOptions={showRaiseOptions}
                    raiseAmount={raiseAmount}
                    setShowRaiseOptions={setShowRaiseOptions}
                    setRaiseAmount={setRaiseAmount}
                    processMove={processMove}
                    getMinimumRaise={getMinimumRaise}
                    lastBet={lastBet}
                    setHandlingProcessMove={setIsHandlingProcessMove}
                    bigBlind={game!.settings.bigBlind}
                />
            }
        </>
    );
}

export default Game;