import {Alert, Avatar, Box, Card, Stack, Typography} from "@mui/material";
import {Turn} from "../../model/Turn.ts";
import Player from "../../model/Player.ts";
import "./PlayerComponent.scss";
import {AnimatePresence, motion} from "framer-motion";
import {useContext, useEffect, useState} from "react";
import {useAccount} from "../../hooks/useAccount.ts";
import Loader from "../loader/Loader.tsx";
import {getHandType} from "../../services/playerService.ts";
import SecurityContext from "../../context/SecurityContext.ts";

interface PlayerProps {
    player: Player & { cards: string[], score: number };
    index: number;
    dealerIndex: number;
    turns: Turn[];
    playerPositions: { top: string, left: string }[];
    winRound: boolean;
    isEndOfRound: boolean;
}

function generateSparkles(count: number) {
    return Array.from({length: count}).map((_, index) => ({
        id: index,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        scale: Math.random() * 0.5 + 0.5,
    }));
}

function PlayerComponent({player, index, dealerIndex, turns, playerPositions, winRound, isEndOfRound}: PlayerProps) {
    const {username} = useContext(SecurityContext)

    const turnsFromPlayer = turns.filter(turn => turn.player.id === player.id);
    const moneyGambledThisPhase = turnsFromPlayer.reduce((sum, turn) => sum + turn.moneyGambled, 0);
    const turn = turnsFromPlayer.reduce((latestTurn, currentTurn) => {
        return new Date(currentTurn.createdAt).getTime() > new Date(latestTurn.createdAt).getTime()
            ? currentTurn
            : latestTurn;
    }, turnsFromPlayer[0]);

    const moneyGambledDisplay = moneyGambledThisPhase == 0 ? "" : moneyGambledThisPhase;
    const playerMove = turn ? (turn.moveMade + "  " + moneyGambledDisplay) : "Waiting...";
    const hasFolded = turn?.moveMade.toString() === "FOLD";
    const isDealer = index === dealerIndex;
    const {isLoading: isLoadingAccount, isError: isErrorLoadingAccount, account} = useAccount(player.username);
    const handType = getHandType(player.score);

    const [playSparkles, setPlaySparkles] = useState(winRound && isEndOfRound);
    const [sparkles] = useState(() => generateSparkles(10));

    useEffect(() => {
        if (winRound) {
            const timer = setTimeout(() => setPlaySparkles(false), 5000);
            return () => clearTimeout(timer);
        }
    });

    function avatarComponent() {
        return (
            <Avatar
                className={`player-avatar ${turn?.moveMade?.toString() === "ON_MOVE" ? "active" : ""}`}
                alt="Profile pic"
                src={account?.activeAvatar?.image}
                sx={{
                    width: 48,
                    height: 48,
                    border: '2px solid #ffd700',
                    left: -80,
                    top: 7,
                    ...(turn?.moveMade?.toString() === "ON_MOVE" && {
                        boxShadow: '0 0 20px 5px rgb(59, 130, 246)',
                        animation: 'pulse 1.5s infinite'
                    })
                }}
            />
        )
    }

    if (isLoadingAccount) return <Loader>Loading avatar...</Loader>
    if (isErrorLoadingAccount) return <Alert severity="error" variant="filled">Error loading avatar!</Alert>

    return (
        <Box
            sx={{
                top: playerPositions[index].top,
                left: playerPositions[index].left,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}
        >
            {isDealer && (
                <div className={`dealer-disk player-${index}`}>
                    <img src="https://storage.googleapis.com/poker_stacks/others/dealer-disk.svg" alt="Dealer disk"/>
                </div>
            )}
            {playSparkles && isEndOfRound ?
                <Box sx={{
                    position: 'relative',
                    display: 'inline-block',
                    overflow: 'visible',
                }}>
                    {avatarComponent()}

                    <AnimatePresence>
                        {playSparkles &&
                            sparkles.map((sparkle) => (
                                <motion.div
                                    key={sparkle.id}
                                    className="sparkle"
                                    initial={{opacity: 0, scale: 0}}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, sparkle.scale, 0],
                                        x: sparkle.x,
                                        y: sparkle.y,
                                    }}
                                    exit={{opacity: 0}}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        ease: "easeInOut",
                                    }}
                                >
                                    {avatarComponent()}
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </Box>

                : avatarComponent()
            }
            <Box sx={{marginTop: '10px'}}>
                <Card sx={{
                    padding: 2,
                    backgroundColor: '#2e3b55',
                    color: '#fff',
                    height: 40,
                    width: 200,
                    position: 'relative',
                    zIndex: 2,
                    borderRadius: 10,
                }}>
                    <Stack direction="column" alignItems="center" spacing={1}>
                        <Box>
                            <Typography variant="body2"
                                        sx={{fontWeight: 'bold', whiteSpace: 'nowrap', color: '#fff', fontSize: 18}}>
                                {player.username || "Placeholder name"}
                            </Typography>
                            <Typography variant="body2" sx={{fontSize: '1em', color: '#ffd700'}}>
                                Chips: {player.money}
                            </Typography>
                        </Box>
                    </Stack>
                </Card>
                <Typography
                    variant="body2"
                    sx={{
                        position: 'absolute',
                        bottom: -20,
                        left: 10,
                        fontStyle: 'italic',
                        fontSize: '0.8em',
                        color: '#aaa',
                    }}
                >
                    {playerMove.replace("_", " ")}
                </Typography>
                {(player.username === username || (isEndOfRound && !hasFolded)) &&
                    <Typography
                        variant="body2"
                        sx={{
                            position: 'absolute',
                            bottom: -20,
                            right: 35,
                            fontStyle: 'italic',
                            fontSize: '0.8em',
                            color: '#aaa',
                        }}
                    >
                        {handType}
                    </Typography>
                }
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 45,
                    left: '30%',
                    display: 'flex',
                    gap: 1,
                    zIndex: 1,
                    marginBottom: 1,
                    marginTop: '8px',
                    opacity: hasFolded ? 0.5 : 1,
                }}
            >
                {player.cards.map((card, cardIndex) => (
                    <Box
                        key={cardIndex}
                        component="img"
                        src={card}
                        alt="Card image"
                        sx={{
                            width: 60,
                            border: '1px solid #fff',
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            borderRadius: '3px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default PlayerComponent;