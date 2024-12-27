import {Alert, Button, Slider} from "@mui/material";
import "./ActionButtons.scss";
import {useIsOnMove} from "../../hooks/useGame";
import Loader from "../loader/Loader.tsx";

interface ActionButtonsProps {
    shouldShowCheckButton: boolean;
    amountToCall: number;
    currentPlayerMoney: number;
    showRaiseOptions: boolean;
    raiseAmount: number;
    setShowRaiseOptions: (value: boolean) => void;
    setRaiseAmount: (value: number) => void;
    getMinimumRaise: (lastBet: number, currentPlayerMoney: number, bigBlind: number) => number;
    lastBet: number;
    processMove: (move: { moveMade: string, amount?: number }) => void;
    setHandlingProcessMove: (value: boolean) => void;
    bigBlind: number;
    gameId: string;
    isGameInProgress: boolean;
}

function ActionButtons({
                           shouldShowCheckButton,
                           amountToCall,
                           currentPlayerMoney,
                           showRaiseOptions,
                           raiseAmount,
                           setShowRaiseOptions,
                           setRaiseAmount,
                           getMinimumRaise,
                           lastBet,
                           processMove,
                           setHandlingProcessMove,
                           bigBlind,
                           gameId,
                           isGameInProgress
                       }: ActionButtonsProps) {


    const {isLoading, isError, isOnMove, refetch: refetchIsOnMove} = useIsOnMove(String(gameId), isGameInProgress);

    if (isLoading) return <Loader>Loading...</Loader>;
    if (isError) return <Alert severity="error" variant="filled">Error...</Alert>;

    async function handleCheck() {
        setHandlingProcessMove(true);
        await processMove({moveMade: "CHECK"});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleFold() {
        setHandlingProcessMove(true);
        await processMove({moveMade: "FOLD"});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleCall(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            await processMove({moveMade: "ALL_IN"});
        else
            await processMove({moveMade: "CALL", amount: amount});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
    }

    async function handleRaise(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            await processMove({moveMade: "ALL_IN"});
        else
            await processMove({moveMade: "RAISE", amount: amount});
        await new Promise((resolve) => setTimeout(resolve, 100));
        await refetchIsOnMove();
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

                        {amountToCall < currentPlayerMoney &&
                            (showRaiseOptions ? (
                                    <Button
                                        className="confirm-button"
                                        variant="contained"
                                        onClick={() => handleRaise(raiseAmount)}
                                    >
                                        Confirm
                                    </Button>
                                ) : (
                                    amountToCall * 2 < currentPlayerMoney ? (
                                        <Button
                                            className="raise-button"
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
                            )}
                    </>
                ) : (
                    <div>Waiting for other players...</div>
                )}
            </div>
        </>
    );
}

export default ActionButtons;
