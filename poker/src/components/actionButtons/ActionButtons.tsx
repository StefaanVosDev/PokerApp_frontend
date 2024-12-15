import {Button, Slider} from "@mui/material";
import "./ActionButtons.scss";

interface ActionButtonsProps {
    shouldShowCheckButton: boolean;
    amountToCall: number;
    currentPlayerMoney: number;
    showRaiseOptions: boolean;
    raiseAmount: number;
    setShowRaiseOptions: (value: boolean) => void;
    setRaiseAmount: (value: number) => void;
    getMinimumRaise: (lastBet: number, currentPlayerMoney: number) => number;
    lastBet: number;
    processMove: (move: { moveMade: string, amount?: number }) => void;
    setHandlingProcessMove: (value: boolean) => void;
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
                           setHandlingProcessMove
                       }: ActionButtonsProps) {

    async function handleCheck() {
        setHandlingProcessMove(true);
        processMove({moveMade: "CHECK"})
    }

    async function handleFold() {
        setHandlingProcessMove(true);
        processMove({moveMade: "FOLD"})
    }

    async function handleCall(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"})
        else
            processMove({moveMade: "CALL", amount: amount})
    }

    async function handleRaise(amount: number) {
        setHandlingProcessMove(true);
        if (amount >= currentPlayerMoney)
            processMove({moveMade: "ALL_IN"})
        else
            processMove({moveMade: "RAISE", amount: amount})
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
                            //todo: getting configuration to set steps as big blind
                            step={10}
                            min={getMinimumRaise(lastBet, currentPlayerMoney)}
                            max={currentPlayerMoney}
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => value === currentPlayerMoney ? "ALL IN" : value}
                        />
                    </div>
                </div>
            }
            <div className="buttons-container">
                <Button className="fold-button" variant="contained" color="secondary"
                        onClick={async () => await handleFold()}>Fold
                </Button>
                {shouldShowCheckButton ? (
                    <Button variant="contained" color="secondary"
                            onClick={async () => await handleCheck()}>Check
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary"
                            onClick={async () => await handleCall(amountToCall > currentPlayerMoney ? currentPlayerMoney : amountToCall)}>
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
                            amountToCall * 2 < currentPlayerMoney ?
                                (
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
                    )
                }
            </div>
        </>
    );
}

export default ActionButtons;