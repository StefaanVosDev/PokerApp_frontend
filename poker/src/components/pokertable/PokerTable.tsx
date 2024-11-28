import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {useCommunityCards} from "../../hooks/useCommunityCards.ts";
import {useParams} from "react-router-dom";
import Loader from "../loader/Loader.tsx";
import {Alert, Button} from "@mui/material";
import {useCurrentTurn} from "../../hooks/useCurrentTurn.ts";
import {useEffect, useState} from "react";
import {useProcessMove} from "../../hooks/useProcessMove.ts";
import {Round} from "../../model/Round.ts";
import {useCreateNewRound} from "../../hooks/useCreateNewRound.ts";

interface PokerTableProps {
    players: Player[];
}

// Fixed player positions
const playerPositions = [
    { top: '26%', left: '23%' },    // Top-center (Player 1)
    { top: '64%', left: '8%' },     // Top-left (Player 2)
    { top: '86%', left: '28%' },    // Bottom-left (Player 3)
    { top: '86%', left: '72%' },    // Bottom-center (Player 4)
    { top: '64%', left: '92%' },    // Bottom-right (Player 5)
    { top: '26%', left: '80%' },    // Top-right (Player 6)
];

export default function PokerTable({ players }: PokerTableProps) {
    const { id: gameId } = useParams<{ id: string }>();
    const [round, ] = useState<Round | null>(null);

    const {isLoading, isError, communityCards} = useCommunityCards(String(gameId));
    const {isLoadingTurn, isErrorLoadingTurn, turnId} = useCurrentTurn(String(gameId));
    const [moveMade, setMoveMade] = useState<string | null>(null);
    const {isProcessingMove, isErrorProcessingMove, processMove} = useProcessMove(turnId?.content, moveMade, String(gameId));
    const {isPending: isLoadingCreateNewRound, isError: isErrorCreateNewRound, triggerNewRound} = useCreateNewRound(String(gameId));


    useEffect(() => {
        if (round?.phase === 'FINISHED' && gameId) {
            triggerNewRound()
        }
    }, [round?.phase, gameId]);

    // if (!round) return <Loader>Initializing new round...</Loader>
    if (isLoading) return <Loader>loading cards</Loader>
    if (isError) return <Alert severity="error">Error loading cards</Alert>
    if (isLoadingTurn) return <Loader>Preparing turn</Loader>
    if (isErrorLoadingTurn || !turnId) return <Alert severity="error">Error loading turn</Alert>
    if (isProcessingMove) return <Loader>registering move</Loader>
    if (isErrorProcessingMove || !processMove) return <Alert severity="error">Error registering move</Alert>
    if (isLoadingCreateNewRound) return <Loader>Initializing new round...</Loader>
    if (isErrorCreateNewRound) return <Alert severity="error">Error initializing new round</Alert>


    function handleCheck() {
        setMoveMade("CHECK");
        processMove()
    }

    const renderPlayers = () => {
        return players.slice(0, 6).map((player, index) => (
            <div
                key={player.id}
                className="player"
                style={{
                    top: playerPositions[index].top,
                    left: playerPositions[index].left,
                }}
            >
                <div className="player-info-wrapper">
                    <div className="player-info">
                        <img src="/src/assets/duckpfp.png" alt="Duck Avatar" className="player-avatar" />
                        <img src="/src/assets/chips.svg" alt="Chips" className="player-chips" />
                    </div>
                    <div className="player-details">
                        <p className="player-name">
                            Placeholder Name <span className="player-money">${player.money}</span>
                        </p>
                    </div>
                </div>

                {/* Render player cards */}
                {/*<div className="player-cards">*/}
                {/*    {player.cards.map((card, cardIndex) => (*/}
                {/*        <img key={cardIndex} src={card} alt="Card" className="player-card"/>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        ));
    };

    const renderCommunityCards = () => {
        return (
            <div className="community-cards">
                {communityCards && communityCards.map((card, index) => (
                    <img key={index} src={`/images/${card.suit.toString().toLowerCase()}_${card.rank}.png`} alt={`${card.rank} of ${card.suit.toString().toLowerCase()}`} className="community-card" />
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="poker-table">
                <img src="/src/assets/table.svg" alt="Poker Table" className="poker-table-image"/>

                {renderPlayers()}

                {renderCommunityCards()}
            </div>
            <div className="d-flex justify-content-center">
                <Button variant="contained" color="secondary" onClick={handleCheck}>Check</Button>
            </div>
        </>
    );
}
