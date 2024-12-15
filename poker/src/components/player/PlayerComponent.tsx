import {Avatar, Box, Card, Stack, Typography} from "@mui/material";
import {Turn} from "../../model/Turn.ts";
import Player from "../../model/Player.ts";
import "./PlayerComponent.scss";

interface PlayerProps {
    player: Player & { cards: string[] };
    index: number;
    dealerIndex: number;
    turns: Turn[];
    playerPositions: { top: string, left: string }[];
}

function PlayerComponent({player, index, dealerIndex, turns, playerPositions}: PlayerProps) {
    const turnsFromPlayer = turns.filter(turn => turn.player.id == player.id);
    const moneyGambledThisPhase = turnsFromPlayer.map(turn => turn.moneyGambled).reduce((sum, money) => sum + money, 0);
    const turn = turnsFromPlayer.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[turnsFromPlayer.length - 1];
    const playerMove = turn ? (turn.moveMade + "  " + (moneyGambledThisPhase == 0 ? "" : moneyGambledThisPhase)) : "Waiting...";
    const hasFolded = turn?.moveMade.toString() === "FOLD";
    const isDealer = index === dealerIndex;

    return (
        <div
            className="player"
            style={{
                top: playerPositions[index].top,
                left: playerPositions[index].left,
            }}
        >
            {isDealer && (
                <div className={`dealer-disk player-${index}`}>
                    <img src="/src/assets/dealer-disk.svg" alt="Dealer disk"/>
                </div>
            )}
            <Avatar
                className={`player-avatar ${turn?.moveMade?.toString() === "ON_MOVE" ? "active" : ""}`}
                alt="Profile pic"
                src="/src/assets/duckpfp.png"
                sx={{
                    width: 32,
                    height: 32,
                    border: '2px solid #ffd700',
                    left: -60
                }}
            />
            <Card sx={{
                padding: 2,
                backgroundColor: '#2e3b55',
                color: '#fff',
                height: 30,
                width: 150,
                position: 'relative',
                zIndex: 2,
                borderRadius: 10,
            }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box>
                        <Typography variant="body2"
                                    sx={{fontWeight: 'bold', whiteSpace: 'nowrap', color: '#fff'}}>
                            {player.username || "Placeholder name"}
                        </Typography>
                        <Typography variant="body2" sx={{fontSize: '0.8em', color: '#ffd700'}}>
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
                {playerMove}
            </Typography>

            <Box
                className={`player-cards ${hasFolded ? " folded" : ""}`}
                sx={{
                    position: 'absolute',
                    bottom: 45,
                    left: '30%',
                    display: 'flex',
                    gap: 1,
                    zIndex: 1,
                }}
            >
                {player.cards.map((card, cardIndex) => (
                    <Box
                        key={cardIndex}
                        component="img"
                        src={card}
                        alt="Card image"
                        sx={{
                            width: 36,
                            border: '1px solid #fff',
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                        }}
                    />
                ))}
            </Box>
        </div>
    );
}

export default PlayerComponent;