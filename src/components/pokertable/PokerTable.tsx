import Player from "../../model/Player.ts";
import {Turn} from "../../model/Turn.ts";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import PlayerComponent from "../player/PlayerComponent.tsx";
import {useGame, useJoinGame} from "../../hooks/useGame.ts";
import {useCommunityCards} from "../../hooks/useRound.ts";
import Loader from "../loader/Loader.tsx";
import {checkUserInGame} from "../../services/pokerTableHelperService/pokerTableHelperService.ts";
import {useContext, useState} from "react";
import {useFriends, useInviteFriend} from "../../hooks/useAccount.ts";
import SecurityContext from "../../context/SecurityContext.ts";

interface PokerTableProps {
    players: (Player & { cards: string[], score: number })[]; // Players with cards as image paths
    turns: Turn[];
    dealerIndex: number;
    maxPlayers: number;
    gameId: string;
    winnings: string[] | null | undefined;
    isEndOfRound: boolean;
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
                                       isEndOfRound,
                                       isGameInProgress
                                   }: PokerTableProps) {
    const {game} = useGame(String(gameId));
    const {username} = useContext(SecurityContext);

    const sortedPlayers = players.sort((a, b) => a.position - b.position);
    const openSpots = maxPlayers - players.length;
    const roundStarted = turns.length > 0;

    const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

    const {
        isLoading: isLoadingCommunityCards,
        isError: isErrorCommunityCards,
        communityCards
    } = useCommunityCards(gameId, roundStarted);
    const { isLoading: isLoadingFriends, isError: isErrorLoadingFriends, friends } = useFriends(username);
    const {isJoining, isErrorJoining, join} = useJoinGame(gameId);
    const { triggerInviteFriends, isPending: isPendingInviteFriends, isError: isErrorInvitingFriends} = useInviteFriend(username, gameId);

    const backOfCard = "https://storage.googleapis.com/poker_stacks/cards/back_of_card.png";


    if (isLoadingCommunityCards)
        return <Loader>Loading community cards...</Loader>;
    if (isErrorCommunityCards)
        return <Alert severity="error" variant="filled">Error loading community cards</Alert>;
    if (isJoining)
        return <Loader>Joining game...</Loader>;
    if (isErrorJoining)
        return <Alert severity="error" variant="filled">Error joining game</Alert>;
    if (isLoadingFriends)
        return <Loader>Loading friends...</Loader>;
    if (isErrorLoadingFriends)
        return <Alert severity="error" variant="filled">Error loading friends</Alert>;
    if (isPendingInviteFriends)
        return <Loader>Sending invites...</Loader>;
    if (isErrorInvitingFriends)
        return <Alert severity="error" variant="filled">Error sending invites</Alert>;

    function handleJoin() {
        join();
    }

    const isUserInGame = checkUserInGame(players, username);

    function handleCloseInvitePopup() {
        setIsInvitePopupOpen(false);
        setSelectedFriends([]);
    }

    function handleFriendSelect(friend: string) {
        setSelectedFriends((prev) =>
            prev.includes(friend)
                ? prev.filter((f) => f !== friend)
                : [...prev, friend]
        );
    }

    function sendInvites(selectedFriends: string[]) {
        triggerInviteFriends(selectedFriends)
    }

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            margin: '67px auto 0 auto',
            '& .poker-table-image': {
                display: 'block',
                width: '100%',
                height: 'auto',
            },
        }} className="poker-table">
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
                const hasFolded = turns.some((turn) => turn.player.username === player.username && turn.moveMade.toString() === 'FOLD');

                const showCards = isGameInProgress && (player.username === username?.toString() || (isEndOfRound && !hasFolded));
                return <PlayerComponent
                    key={player.id}
                    player={{
                        ...player,
                        cards: showCards ? player.cards : (isGameInProgress ? [backOfCard, backOfCard] : []),
                        score: player.score
                    }}
                    index={index}
                    dealerIndex={dealerIndex}
                    turns={turns}
                    playerPositions={playerPositions}
                    winRound={winnings ? winnings.includes(player.id) : false}
                    isEndOfRound={isEndOfRound}
                />
            })}

            {Array.from({length: openSpots}).map((_, index) => (
                isUserInGame ? (
                    <Button
                        key={index}
                        variant="contained"
                        color="primary"
                        onClick={() => setIsInvitePopupOpen(true)}
                        disabled={game?.status === "IN_PROGRESS" || game?.status === "FINISHED"}
                        sx={{
                            position: 'absolute',
                            top: playerPositions[players.length + index].top,
                            left: playerPositions[players.length + index].left,
                        }}
                    >
                        Invite
                    </Button>
                    ) : (
                <Button
                    key={index}
                    variant="contained"
                    color="primary"
                    onClick={handleJoin}
                    disabled={game?.status === "IN_PROGRESS" || game?.status === "FINISHED" || isUserInGame}
                    sx={{
                        position: 'absolute',
                        top: playerPositions[players.length + index].top,
                        left: playerPositions[players.length + index].left,
                    }}
                >
                    Join
                </Button>
                )
            ))}
            <Box sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                gap: '10px',
                '& .community-card': {
                    width: 60,
                    border: '1px solid #fff',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    borderRadius: '3px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
                },
            }}>
                {communityCards?.map((card, index) => (
                        <img key={index} src={`https://storage.googleapis.com/poker_stacks/cards/${card.suit.toString().toLowerCase()}_${card.rank}.png`}
                             alt={`${card.suit.toString().toLowerCase()}_${card.rank}`} className="community-card"/>
                    )
                )}
            </Box>
            <Dialog
                open={isInvitePopupOpen}
                onClose={handleCloseInvitePopup}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        borderRadius: "12px",
                        fontFamily: "Kalam, sans-serif",
                        minWidth: "250px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                    }}
                >
                    Invite Friends
                </DialogTitle>
                <DialogContent
                    sx={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "8px 16px",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#3b82f6",
                            borderRadius: "8px",
                            border: "2px solid rgba(26, 32, 44, 0.9)",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: "#2563eb",
                        },
                    }}
                >
                    {friends?.length === 0 ? (
                        <Typography sx={{ color: "white", textAlign: "center" }}>
                            No friends available to invite.
                        </Typography>
                    ) : (
                        <List>
                            {friends?.map(({username}) => (
                                <ListItem
                                    key={username}
                                    onClick={() => handleFriendSelect(username)}
                                    sx={{ cursor: "pointer", padding: "0px" }}
                                >
                                    <Checkbox sx={{
                                        color: 'white'
                                    }} checked={selectedFriends.includes(username)} />
                                    <ListItemText primary={username} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseInvitePopup}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            sendInvites(selectedFriends);
                            handleCloseInvitePopup();
                        }}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Send Invites
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}