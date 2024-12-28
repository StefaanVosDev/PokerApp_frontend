import PokerTable from "../pokertable/PokerTable.tsx";
import {Alert, Button} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";
import {calculateCurrentTurnDetails, calculateLastBet, getMinimumRaise} from "../../services/turnService.ts";
import {mapCardToImage} from "../../services/mapToCardService.ts";
import ActionButtons from "../actionButtons/ActionButtons.tsx";
import {useCurrentTurn, useProcessMove, useTurns} from "../../hooks/useTurn.ts";
import {useCreateNewRoundIfFinished, useCurrentRound, useDividePot} from "../../hooks/useRound.ts";
import {usePlayersHand} from "../../hooks/usePlayer.ts";
import {useGame} from "../../hooks/useGame.ts";
import {useUpdateGameStatus} from "../../hooks/useUpdateGameStatus";
import SecurityContext from "../../context/SecurityContext";
import ChatLog from "./ChatLog.tsx";
import ChatIcon from "./ChatIcon.tsx";
import Timer from "./Timer.tsx";

function Game() {
    const {id: gameId} = useParams<{ id: string }>();

    const navigate = useNavigate();
    const [isEndOfRound, setIsEndOfRound] = useState(false);
    const [isHandlingProcessMove, setIsHandlingProcessMove] = useState(false);
    const [isGameInProgress, setIsGameInProgress] = useState(false);

    const {
        isLoadingRound,
        isErrorLoadingRound,
        round
    } = useCurrentRound(String(gameId), isEndOfRound, isGameInProgress);
    const {isErrorLoadingTurn, isLoadingTurn, turn} = useCurrentTurn(String(gameId), isEndOfRound, isHandlingProcessMove, isGameInProgress);

    const {isLoading: gameLoading, isError: gameError, game} = useGame(String(gameId));
    const playerIds = game ? game.players.map((player) => player.id) : [];
    const {isLoading: handsLoading, isError: handsError, playersHand} = usePlayersHand(playerIds, isEndOfRound);
    const roundId = round ? round.id : "";
    const {
        isProcessingMove,
        isErrorProcessingMove,
        processMove,
        isSuccessProcessingMove
    } = useProcessMove(turn?.id, String(gameId), String(roundId));
    const {isLoadingTurns, isErrorLoadingTurns, turns} = useTurns(roundId, isGameInProgress);
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
        isSuccessDividingPot,
        winnings
    } = useDividePot(roundId);
    const [totalMoneyInPot, setTotalMoneyInPot] = useState(0);
    const {
        updateStatus,
        isPending: isUpdatingStatus,
    } = useUpdateGameStatus();
    const {loggedInUser} = useContext(SecurityContext)
    const [isGameStatusError, setIsGameStatusError] = useState(false);
    const isFirstPlayer = game && game.players.length > 0 && game.players[0].username === loggedInUser?.toString();
    const timerActive = isGameInProgress && game?.settings.timer

    useEffect(() => {
        if (game) {
            setIsGameInProgress(game.status === "IN_PROGRESS");
        }
    }, [game]);

    const [isChatLogOpen, setIsChatLogOpen] = useState(false);

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

        const {
            shouldShowCheckButton,
            amountToCall,
            raiseAmount
        } = calculateCurrentTurnDetails(turns, round, lastBet, game.settings.bigBlind);
        setShouldShowCheckButton(shouldShowCheckButton);
        setAmountToCall(amountToCall);
        setRaiseAmount(raiseAmount);
    }, [turns, round]);


    useEffect(() => {
        if (round && round.phase === "FINISHED") {
            setIsEndOfRound(true);
            setTimeout(() => {
                triggerDividePot();
            }, 1000);
        }
    }, [round?.phase]);

    useEffect(() => {
        if (game && game.players.length === 1 && game.status === "IN_PROGRESS") {
            const winner = game.players[0]
            navigate(`/end-game/${winner.id}`)
        }
    }, [game]);

    useEffect(() => {
        if (isSuccessDividingPot) {
            setTimeout(() => {
                triggerNewRound()
            }, 5000)
        }
    }, [isSuccessDividingPot]);

    useEffect(() => {
        if (isSuccessCreatingNewRound) {
            setIsEndOfRound(false);
        }
    }, [isSuccessCreatingNewRound, isErrorCreateNewRoundIfFinished]);

    async function handleUpdateGameStatus() {
        setIsGameStatusError(false);
        if (gameId) {
            try {
                updateStatus(gameId);
            } catch (error) {
                console.error("Error updating game status:", error);
                setIsGameStatusError(true);
            }
        }
    }


    if (isProcessingMove)
        return <Loader>registering move</Loader>;
    if (isErrorProcessingMove || !processMove)
        return <Alert severity="error" variant="filled">Error registering move</Alert>;

    if (isLoadingRound && isGameInProgress)
        return <Loader>Loading current round...</Loader>;

    if (isErrorLoadingRound && isGameInProgress)
        return <Alert severity="error" variant="filled">Error loading current round</Alert>;

    if (isLoadingTurns && isGameInProgress)
        return <Loader>Loading turns...</Loader>;

    if (isErrorLoadingTurns && isGameInProgress)
        return <Alert severity="error" variant="filled">Error loading turns</Alert>;

    if (gameLoading)
        return <Loader>Loading game...</Loader>;

    if (gameError || !game)
        return <Alert severity="error" variant="filled">Error loading game data</Alert>;

    if (handsLoading)
        return <Loader>Loading hands...</Loader>;

    if (handsError)
        return <Alert severity="error" variant="filled">Error loading hands</Alert>;

    if (isDividingPot)
        return <Loader>Splitting winnings...</Loader>;

    if (isErrorDividingPot)
        return <Alert severity="error" variant="filled">Error splitting winnings</Alert>;

    if (isLoadingCreateNewRoundIfFinished)
        return <Loader>Starting new round...</Loader>;

    if (isErrorCreateNewRoundIfFinished)
        return <Alert severity="error" variant="filled">Error starting new round</Alert>;

    if (isLoadingTurn) return <Loader>preparing next turn...</Loader>

    if (isErrorLoadingTurn) return <Alert severity="error" variant="filled">Error preparing next turn!</Alert>


    // Map each player's cards
    const playersWithCards = game.players.map((player) => ({
        ...player,
        cards: (playersHand[player.id] || []).map(mapCardToImage), // Map cards to images
    }));

    const toggleChatLog = () => {
        setIsChatLogOpen(!isChatLogOpen);
    }

    function handleExpire() {
        if (timerActive && setIsHandlingProcessMove && processMove) {
            setIsHandlingProcessMove(true)
            processMove({moveMade: "FOLD"})
        }
    }

    return (
        <>
            <div className="updateStatus">
                {!isGameInProgress && (
                    <div>
                        <h2>Waiting for players...</h2>
                        {isFirstPlayer && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateGameStatus}
                                disabled={isUpdatingStatus || !gameId || game.status !== "WAITING"}
                            >
                                Start game
                            </Button>
                        )}
                        {isGameStatusError && (
                            <Alert severity="error" variant="filled">
                                Wait of another player or ask to game creator to start it!
                            </Alert>
                        )}
                    </div>
                )}
            </div>
            {timerActive && turn && <Timer duration={60} turnId={turn.id} onExpire={handleExpire}/>}
            <PokerTable
                players={playersWithCards}
                turns={turns ? turns.filter(turn => turn.madeInPhase == round!.phase || turn.moveMade.toString() === "FOLD") : []}
                dealerIndex={round ? round.dealerIndex : 0}
                maxPlayers={game.maxPlayers}
                gameId={String(gameId)}
                winnings={winnings}
                animationAllowed={isEndOfRound}
                loggedInUser={loggedInUser}
                isGameInProgress={isGameInProgress}
            />
            {isGameInProgress && (
                <div className="pot-money">
                    Pot ${totalMoneyInPot}
                </div>)}
            {!isEndOfRound && isGameInProgress && (
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
                    bigBlind={game.settings.bigBlind}
                    gameId={String(gameId)}
                    isGameInProgress={isGameInProgress}
                />
            )}
            {loggedInUser && game.players.map(player => player.username).includes(loggedInUser.toString()) && (
                <>
                    <button className="toggle-chat-log" onClick={toggleChatLog}>
                        <ChatIcon/>
                    </button>
                    {isChatLogOpen && <ChatLog
                        gameId={String(gameId)}
                        loggedInUserPosition={game.players.filter(player => player.username == loggedInUser?.toString())[0]?.position}
                    />}
                </>
            )}
        </>
    );
}

export default Game;