import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {Turn} from "../../model/Turn.ts";
import {Avatar, Button} from "@mui/material";
import PlayerComponent from "../player/PlayerComponent.tsx";
import {useGame, useJoinGame} from "../../hooks/useGame.ts";
import {useCommunityCards} from "../../hooks/useRound.ts";

interface PokerTableProps {
    players: (Player & { cards: string[] })[]; // Players with cards as image paths
    turns: Turn[];
    dealerIndex: number;
    maxPlayers: number;
    gameId: string;
    winnings: string[] | null | undefined;
    animationAllowed: boolean;
    loggedInUser: string | undefined;
    isGameInProgress: boolean;
}

const playerPositions = [
    {top: '20%', left: '80%'},
    {top: '49%', left: '95%'},
    {top: '80%', left: '72%'},
    {top: '80%', left: '28%'},
    {top: '58%', left: '8%'},
    {top: '20%', left: '23%'},
];

export default function PokerTable({players, turns, dealerIndex, maxPlayers, gameId, winnings, animationAllowed, loggedInUser,isGameInProgress}: PokerTableProps) {
    const sortedPlayers = players.sort((a, b) => a.position - b.position);
    const openSpots = maxPlayers - players.length;
    const {game} = useGame(String(gameId));
    const roundStarted = turns.length > 0;

    const {
        isLoading: isLoadingCommunityCards,
        isError: isErrorCommunityCards,
        communityCards
    } = useCommunityCards(gameId, roundStarted);
    const {isJoining, isErrorJoining, join} = useJoinGame(gameId);

    if (isLoadingCommunityCards)
        return <div>Loading community cards...</div>;
    if (isErrorCommunityCards)
        return <div>Error loading community cards</div>;
    if (isJoining)
        return <div>Joining game...</div>;
    if (isErrorJoining)
        return <div>Error joining game</div>;

    const handleJoin = async () => {
            await join();
    };

    const isUserInGame = players.some((player) => player.username === loggedInUser?.toString());

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
            {sortedPlayers.slice(0, 6).map((player, index) => {
                const showCards = isGameInProgress && player.username === loggedInUser?.toString();
                return <PlayerComponent
                    key={player.id}
                    player={{...player, cards: showCards ? player.cards : (isGameInProgress ? ["/images/back_of_card.png", "/images/back_of_card.png"] : [])}}
                    index={index}
                    dealerIndex={dealerIndex}
                    turns={turns}
                    playerPositions={playerPositions}
                    winRound={winnings ? winnings.includes(player.id) : false}
                    animationAllowed={animationAllowed}
                />
            })}

            {Array.from({length: openSpots}).map((_, index) => (
                <Button
                    key={index}
                    variant="contained"
                    color="primary"
                    onClick={handleJoin}
                    disabled={game?.status === "IN_PROGRESS" || game?.status === "FINISHED" || isUserInGame}
                    style={{
                        position: 'absolute',
                        top: playerPositions[players.length + index].top,
                        left: playerPositions[players.length + index].left,
                    }}
                >
                    Join
                </Button>
            ))}
            <div className="community-cards">
                {communityCards && communityCards.map((card, index) => (
                        <img key={index} src={`/images/${card.suit.toString().toLowerCase()}_${card.rank}.png`}
                             alt={`${card.suit.toString().toLowerCase()}_${card.rank}`} className="community-card"/>
                    )
                )}
            </div>
        </div>
    );
}