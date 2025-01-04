import {Alert, Button, Slider} from "@mui/material";
import "./ActionButtons.scss";
import {useIsOnMove} from "../../hooks/useGame";
import Loader from "../loader/Loader.tsx";
import {calculateCurrentTurnDetails, calculateLastBet, getMinimumRaise} from "../../services/turnService.ts";
import {useEffect, useState} from "react";
import {Turn} from "../../model/Turn.ts";
import {Round} from "../../model/Round.ts";

interface ActionButtonsProps {
    showRaiseOptions: boolean;
    setShowRaiseOptions: (value: boolean) => void;
    processMove: (move: { moveMade: string, amount?: number }) => void;
    setHandlingProcessMove: (value: boolean) => void;
    bigBlind: number;
    gameId: string;
    isGameInProgress: boolean;
    turns: Turn[];
    round: Round | undefined | null;
}

function ActionButtons({
                           showRaiseOptions,
                           setShowRaiseOptions,
                           processMove,
                           setHandlingProcessMove,
                           bigBlind,
                           gameId,
                           isGameInProgress,
                           turns,
                           round
                       }: ActionButtonsProps) {

    const {isLoading, isError, isOnMove, refetch: refetchIsOnMove} = useIsOnMove(String(gameId), isGameInProgress);

    const [raiseAmount, setRaiseAmount] = useState(0);

    const currentPlayer = turns?.find(turn => turn.moveMade.toString() === "ON_MOVE")?.player;
    const currentPlayerMoney = currentPlayer ? currentPlayer.money : 0;

    const lastBet = calculateLastBet(turns, round);

    useEffect(() => {
        if (showRaiseOptions) {
            const minRaise = getMinimumRaise(lastBet, currentPlayerMoney, bigBlind);
            setRaiseAmount(minRaise);
        }
    }, [lastBet, currentPlayerMoney, bigBlind, showRaiseOptions]);

    if (!turns || !round) return <Loader>Loading...</Loader>;

    const {shouldShowCheckButton, amountToCall} = calculateCurrentTurnDetails(turns, round, lastBet);

    if (isLoading) return <Loader>Loading...</Loader>;
    if (isError) return <Alert severity="error" variant="filled">Error...</Alert>;

    async function handleCheck() {
        setHandlingProcessMove(true);
        processMove({moveMade: "CHECK"});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleFold() {
        setHandlingProcessMove(true);
        processMove({moveMade: "FOLD"});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleCall(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"});
        else
            processMove({moveMade: "CALL", amount: amount});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleRaise(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"});
        else
            processMove({moveMade: "RAISE", amount: amount});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    function renderRaiseButton() {
        if (amountToCall < currentPlayerMoney) {
            if (showRaiseOptions) {
                return (
                    <Button
                        className="confirm-button"
                        variant="contained"
                        onClick={() => handleRaise(raiseAmount)}
                    >
                        Confirm
                    </Button>
                );
            } else if (amountToCall * 2 < currentPlayerMoney) {
                return (
                    <Button
                        className="raise-button"
                        variant="contained"
                        onClick={() => setShowRaiseOptions(true)}
                    >
                        Raise
                    </Button>
                );
            } else {
                return (
                    <Button
                        className="raise-button"
                        variant="contained"
                        onClick={() => handleRaise(currentPlayerMoney)}
                    >
                        All In
                    </Button>
                );
            }
        }
        return null;
    }

    return (
        <>
            {showRaiseOptions &&
                <div className="raise-options">
                    <div className="slider-container">
                        <Slider
                            orientation="horizontal"
                            value={raiseAmount}
                            onChange={(_event, newValue) => setRaiseAmount(newValue as number)}
                            step={10}
                            min={getMinimumRaise(lastBet, currentPlayerMoney, bigBlind)}
                            max={currentPlayerMoney}
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => value === currentPlayerMoney ? "ALL IN" : value}
                        />
                    </div>
                </div>
            }
            <div className="buttons-container">
                {isOnMove ? (
                    <>
                        <Button
                            className="fold-button"
                            variant="contained"
                            color="secondary"
                            onClick={handleFold}
                        >
                            Fold
                        </Button>
                        {shouldShowCheckButton ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCheck}
                            >
                                Check
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleCall(amountToCall > currentPlayerMoney ? currentPlayerMoney : amountToCall)}
                            >
                                {amountToCall > currentPlayerMoney ? "Call all-in $" + currentPlayerMoney : "Call $" + amountToCall}
                            </Button>
                        )}
                        {renderRaiseButton()}
                    </>
                ) : (
                    <div>Waiting for other players...</div>
                )}
            </div>
        </>
    );
}

export default ActionButtons;
