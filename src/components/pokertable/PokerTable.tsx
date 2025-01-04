import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {Turn} from "../../model/Turn.ts";
import {Alert, Avatar, Button} from "@mui/material";
import PlayerComponent from "../player/PlayerComponent.tsx";
import {useGame, useJoinGame} from "../../hooks/useGame.ts";
import {useCommunityCards} from "../../hooks/useRound.ts";
import Loader from "../loader/Loader.tsx";

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

export default function PokerTable({
                                       players,
                                       turns,
                                       dealerIndex,
                                       maxPlayers,
                                       gameId,
                                       winnings,
                                       animationAllowed,
                                       loggedInUser,
                                       isGameInProgress
                                   }: PokerTableProps) {
    const {game} = useGame(String(gameId));

    const sortedPlayers = players.sort((a, b) => a.position - b.position);
    const openSpots = maxPlayers - players.length;
    const roundStarted = turns.length > 0;

    const {
        isLoading: isLoadingCommunityCards,
        isError: isErrorCommunityCards,
        communityCards
    } = useCommunityCards(gameId, roundStarted);
    const {isJoining, isErrorJoining, join} = useJoinGame(gameId);

    if (isLoadingCommunityCards)
        return <Loader>Loading community cards...</Loader>;
    if (isErrorCommunityCards)
        return <Alert severity="error" variant="filled">Error loading community cards</Alert>;
    if (isJoining)
        return <Loader>Joining game...</Loader>;
    if (isErrorJoining)
        return <Alert severity="error" variant="filled">Error joining game</Alert>;

    function handleJoin() {
        join();
    }

    const isUserInGame = players.some((player) => player.username === loggedInUser?.toString());

    return (
        <div className="poker-table">
            <img src="https://storage.googleapis.com/poker_stacks/others/table.svg" alt="Poker Table" className="poker-table-image"/>
            <div className="dealer">
                <Avatar
                    alt="Dealer"
                    src="https://storage.googleapis.com/poker_stacks/others/dealer.svg"
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
                    player={{
                        ...player,
                        cards: showCards ? player.cards : (isGameInProgress ? ["https://storage.googleapis.com/poker_stacks/cards/back_of_card.png", "https://storage.googleapis.com/poker_stacks/cards/back_of_card.png"] : [])
                    }}
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
                {communityCards?.map((card, index) => (
                        <img key={index} src={`https://storage.googleapis.com/poker_stacks/cards/${card.suit.toString().toLowerCase()}_${card.rank}.png`}
                             alt={`${card.suit.toString().toLowerCase()}_${card.rank}`} className="community-card"/>
                    )
                )}
            </div>
        </div>
    );
}