import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {PlayingCard} from "../../model/PlayingCard.ts";
import {Turn} from "../../model/Turn.ts";
import {Avatar, Box, Card, Stack, Typography, Button} from "@mui/material";
import {joinGame} from "../../services/dataService.ts";

interface PokerTableProps {
    players: (Player & { cards: string[] })[]; // Players with cards as image paths
    communityCards: PlayingCard[]; // Array of card image paths for the community cards
    turns: Turn[];
    dealerIndex: number;
    maxPlayers: number;
    gameId: string;
    refetchGame: () => void;
}

const playerPositions = [
    {top: '20%', left: '80%'},
    {top: '58%', left: '92%'},
    {top: '80%', left: '72%'},
    {top: '80%', left: '28%'},
    {top: '58%', left: '8%'},
    {top: '20%', left: '23%'},
];

export default function PokerTableSimple({players, communityCards, turns, dealerIndex, maxPlayers, gameId,refetchGame}: PokerTableProps) {
    const sortedPlayers = players.sort((a, b) => a.position - b.position);
    const openSpots = maxPlayers - players.length;

    const handleJoin = async () => {
        try {
            await joinGame(gameId);
            refetchGame();
        } catch (error) {
            console.error("Error joining game:", error);
        }
    };

    const renderPlayers = () => {
        return sortedPlayers.slice(0, 6).map((player, index) => {
            const turnsFromPlayer = turns.filter(turn => turn.player.id == player.id);
            const moneyGambledThisPhase = turnsFromPlayer.map(turn => turn.moneyGambled).reduce((sum, money) => sum + money, 0);

            const turn = turnsFromPlayer[turnsFromPlayer.length - 1];

            const playerMove = turn ? (turn.moveMade + "  " + (moneyGambledThisPhase == 0 ? "" : moneyGambledThisPhase)) : "Waiting...";
            const hasFolded = turn?.moveMade.toString() === "FOLD";
            const isDealer = index === dealerIndex;

            return (
                <div
                    key={player.id}
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
                        className={`player-avatar ${turn?.moveMade?.toString()==="ON_MOVE" ? "active" : ""}`}
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
        });
    };
    const renderJoinButtons = () => {
        return Array.from({ length: openSpots }).map((_, index) => (
            <Button
                key={index}
                variant="contained"
                color="primary"
                onClick={handleJoin}
                style={{
                    position: 'absolute',
                    top: playerPositions[players.length + index].top,
                    left: playerPositions[players.length + index].left,
                }}
            >
                Join
            </Button>
        ));
    };

    const renderCommunityCards = () => {
        return (
            <div className="community-cards">
                {communityCards.map((card, index) => (
                        <img key={index} src={`/images/${card.suit.toString().toLowerCase()}_${card.rank}.png`}
                             alt={`${card.suit.toString().toLowerCase()}_${card.rank}`} className="community-card"/>
                    )
                )}
            </div>
        )
    };

    return (
        <div className="poker-table">
            <img src="/src/assets/table.svg" alt="Poker Table" className="poker-table-image"/>

            <div className="dealer">
                <Avatar
                    alt="Dealer"
                    src="/src/assets/dealer-avatar.jpg"
                    sx={{
                        width: 100,
                        height: 100,
                        bottom: 550,
                        left: "45%",
                        border: "2px solid #fff",
                    }}
                />
            </div>
            {renderPlayers()}
            {renderJoinButtons()}
            {renderCommunityCards()}
        </div>
    );
}