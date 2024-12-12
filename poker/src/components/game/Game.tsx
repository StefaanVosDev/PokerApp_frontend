import PokerTableSimple from "../pokertable/PokerTableSimple.tsx";
import {useGame} from "../../hooks/useGame.ts";
import {usePlayersHand} from "../../hooks/usePlayersHand.ts";
import Card from "../../model/Card.ts";
import {Alert, Button, Slider} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {useEffect, useState} from "react";
import {useProcessMove} from "../../hooks/useProcessMove.ts";
import Loader from "../loader/Loader.tsx";
import "./Game.scss";
import {useCurrentRound} from "../../hooks/useCurrentRound.ts";
import {useTurns} from "../../hooks/useTurns.ts";
import {useDividePot} from "../../hooks/useDividePot.ts";
import {useCreateNewRoundIfFinished} from "../../hooks/useCreateNewRoundIfFinished.ts";
import {Round} from "../../model/Round.ts";
import {Turn} from "../../model/Turn.ts";

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
    const {id: gameId} = useParams<{ id: string }>();

    const navigate = useNavigate();
    const {isLoading, isError, communityCards} = useCommunityCards(String(gameId));
    const {isLoadingTurn, isErrorLoadingTurn, turnId, refetch: refetchCurrentTurn} = useCurrentTurn(String(gameId));
    const {isLoadingRound, isErrorLoadingRound, round, refetch: refetchCurrentRound} = useCurrentRound(String(gameId));
    const {isLoading: gameLoading, isError: gameError, game, refetchGame} = useGame(String(gameId));
    const playerIds = game ? game.players.map((player) => player.id) : [];
    const {
        isLoading: handsLoading,
        isError: handsError,
        playersHand,
        refetch: refetchHands
    } = usePlayersHand(playerIds);
    const roundId = round ? round.id : "";
    const {
        isProcessingMove,
        isErrorProcessingMove,
        processMove,
        isSuccessProcessingMove
    } = useProcessMove(turnId?.content, String(gameId), String(roundId));
    const {isLoadingTurns, isErrorLoadingTurns, turns, refetchTurns} = useTurns(roundId);
    const [shouldShowCheckButton, setShouldShowCheckButton] = useState(false);
    const [amountToCall, setAmountToCall] = useState(0);
    const [currentPlayerMoney, setCurrentPlayerMoney] = useState(1000);
    const [lastBet, setLastBet] = useState(0);
    const [raiseAmount, setRaiseAmount] = useState(0);
    const [showRaiseOptions, setShowRaiseOptions] = useState(false);
    const {isPending: isLoadingCreateNewRoundIfFinished, isError: isErrorCreateNewRoundIfFinished, triggerNewRound, isSuccessCreatingNewRound} = useCreateNewRoundIfFinished(String(gameId), roundId);
    const {isDividingPot, isErrorDividingPot, triggerDividePot, isSuccessDividingPot} = useDividePot(roundId, String(gameId));
    const [totalMoneyInPot, setTotalMoneyInPot] = useState(0);
    //const {isLoading: isLoadingOnMove, isError: isErrorOnMove, isOnMove} = useIsOnMove(gameId);

    useEffect(() => {
        if (isSuccessProcessingMove) {
            refetchTurns();
            setShowRaiseOptions(false);
        }

        refetchCurrentRound();
        if (turns) {
            const currentPlayer = turns.find(turn => turn.moveMade.toString() === "ON_MOVE")?.player;
            setCurrentPlayerMoney(currentPlayer ? currentPlayer.money : 0);
            setTotalMoneyInPot(turns.reduce((sum, turn) => sum + turn.moneyGambled, 0));
        }
    }, [isSuccessProcessingMove, turns]);


    function calculateLastBet(turns: Turn[], round: Round) {
        const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
        return currentPhaseTurns.reduce((max, turn) => Math.max(max, turn.moneyGambled), 0);
    }

    function calculateCurrentTurnDetails(turns: Turn[], round: Round, lastBet: number) {
        const currentTurn = turns.find(turn => turn.moveMade.toString() === "ON_MOVE");
        if (!currentTurn) return {shouldShowCheckButton: false, amountToCall: 0, raiseAmount: 0};

        const currentPhaseTurns = turns.filter(turn => turn.madeInPhase === round.phase);
        const totalGambled = currentPhaseTurns
            .filter(turn => turn.player.id === currentTurn.player.id)
            .reduce((sum, turn) => sum + turn.moneyGambled, 0);

        return {
            shouldShowCheckButton: totalGambled === lastBet,
            amountToCall: lastBet - totalGambled,
            raiseAmount: getMinimumRaise(),
        };
    }

    useEffect(() => {
        if (!turns || !round) return;

        refetchGame();
        const lastBet = calculateLastBet(turns, round);
        setLastBet(lastBet);

        const {shouldShowCheckButton, amountToCall, raiseAmount} =
            calculateCurrentTurnDetails(turns, round, lastBet);
        setShouldShowCheckButton(shouldShowCheckButton);
        setAmountToCall(amountToCall);
        setRaiseAmount(raiseAmount);
    }, [turns, round]);


    useEffect(() => {
        if (round && round.phase === "FINISHED") {
            triggerDividePot()
        }
    }, [round?.phase]);

    useEffect(() => {
        if (isSuccessDividingPot) {
            setTimeout(() => {
                refetchGame();
            }, 10000)
        }
    }, [isSuccessDividingPot]);

    useEffect(() => {
        if (game && isSuccessDividingPot) {
            if (game && game.players.length === 1) {
                const winner = game.players[0]
                navigate(`/end-game/${winner.id}`)
            } else if (!isSuccessCreatingNewRound) {
                triggerNewRound()
            }
        }
    }, [game, isSuccessDividingPot]);

    useEffect(() => {
        if (isSuccessCreatingNewRound) {
            refetchGame()
            refetchCurrentRound()
            refetchTurns()
            refetchCurrentTurn()
        }
    }, [isSuccessCreatingNewRound]);


    if (isLoading) return <Loader>loading cards</Loader>
    if (isError || !communityCards) return <Alert severity="error" variant="filled">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || (!turnId && round?.phase !== "FINISHED")) return <Alert severity="error" variant="filled">Error loading turn</Alert>
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
    if (isLoadingCreateNewRoundIfFinished) return <Loader>Starting new round...</Loader>
    if (isErrorCreateNewRoundIfFinished) return <Alert severity="error" variant="filled">Error starting new round</Alert>
    if (isErrorDividingPot) return <Alert severity="error" variant="filled">Error splitting winnings</Alert>

    async function handleCheck() {
        await refetchCurrentRound();
        await refetchHands();
        processMove({moveMade: "CHECK"})
    }

    async function handleFold() {
        await refetchCurrentRound();
        await refetchHands();
        processMove({moveMade: "FOLD"})
    }

    async function handleCall(amount: number) {
        await refetchCurrentRound();
        await refetchHands();
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"})
        else
            processMove({moveMade: "CALL", amount: amount})
    }

    async function handleRaise(amount: number) {
        await refetchCurrentRound();
        await refetchHands();
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"})
        else
            processMove({moveMade: "RAISE", amount: amount})
    }

    // Map each player's cards
    const playersWithCards = game.players.map((player) => ({
        ...player,
        cards: (playersHand[player.id] || []).map(mapCardToImage), // Map cards to images
    }));

    function getMinimumRaise(): number {
        if (lastBet * 2 > currentPlayerMoney) return currentPlayerMoney;
        if (lastBet > 10) return lastBet * 2
        return 10;
    }

    return (
        <>
            <PokerTableSimple
                players={playersWithCards}
                communityCards={communityCards}
                turns={turns.filter(turn => turn.madeInPhase == round!.phase || turn.moveMade.toString() === "FOLD")}
                dealerIndex={round ? round.dealerIndex : 0}
                maxPlayers={game.maxPlayers}
                gameId={gameId ? gameId : ""}
                refetchGame={refetchGame}
            />
            <div className="pot-money">
                Pot ${totalMoneyInPot}
            </div>
            {showRaiseOptions &&
                <div className="raise-options">
                    <div className="slider-container">
                        <Slider
                            orientation="horizontal"
                            value={raiseAmount}
                            onChange={(_event, newValue) => setRaiseAmount(newValue as number)}
                            //todo: getting configuration to set steps as big blind
                            step={10}
                            min={getMinimumRaise()}
                            max={currentPlayerMoney}
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => value === currentPlayerMoney ? "ALL IN" : value}
                        />
                    </div>
                </div>
            }
            <div className="buttons-container">
                <Button className="fold-button" variant="contained" color="secondary"
                       // disabled={isLoadingOnMove || isErrorOnMove || isOnMove}
                        onClick={async () => await handleFold()}>Fold
                </Button>
                {shouldShowCheckButton ? (
                    <Button variant="contained" color="secondary"
                            //disabled={isLoadingOnMove || isErrorOnMove || isOnMove}
                            onClick={async () => await handleCheck()}>Check
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary"
                            //disabled={isLoadingOnMove || isErrorOnMove || isOnMove}
                            onClick={async () => await handleCall(amountToCall > currentPlayerMoney ? currentPlayerMoney : amountToCall)}>
                        {amountToCall > currentPlayerMoney ? "Call all-in $"+currentPlayerMoney : "Call $" +amountToCall}
                    </Button>
                )}

                {amountToCall < currentPlayerMoney &&
                    (showRaiseOptions ? (
                            <Button
                                className="confirm-button"
                                //disabled={isLoadingOnMove || isErrorOnMove || isOnMove}
                                variant="contained"
                                onClick={() => handleRaise(raiseAmount)}
                            >
                                Confirm
                            </Button>
                        ) : (
                            amountToCall * 2 < currentPlayerMoney ?
                                (
                                    <Button
                                        className="raise-button"
                                       // disabled={isLoadingOnMove || isErrorOnMove || isOnMove}
                                        variant="contained"
                                        onClick={() => setShowRaiseOptions(true)}
                                    >
                                        Raise
                                    </Button>
                                ) : (
                                    <Button
                                        className="raise-button"
                                        variant="contained"
                                        onClick={() => handleRaise(currentPlayerMoney)}
                                    >
                                        All In
                                    </Button>
                                )
                        )
                    )
                }

            </div>
        </>

    );

}

export default Game;