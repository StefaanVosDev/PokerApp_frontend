import './PokerTable.scss';
import Player from "../../model/Player.ts";

interface PokerTableProps {
    players: Player[];
    communityCards: string[]; // Array of card image paths for the community cards
}

// Fixed player positions
const playerPositions = [
    { top: '20%', left: '23%' },    // Top-center (Player 1)
    { top: '58%', left: '8%' },     // Top-left (Player 2)
    { top: '80%', left: '28%' },    // Bottom-left (Player 3)
    { top: '80%', left: '72%' },    // Bottom-center (Player 4)
    { top: '58%', left: '92%' },    // Bottom-right (Player 5)
    { top: '20%', left: '80%' },    // Top-right (Player 6)
];

export default function PokerTable({ players, communityCards }: PokerTableProps) {
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
                        <img src={player.avatar} alt={`${player.name}'s Avatar`} className="player-avatar" />
                        <img src="/src/assets/chips.svg" alt="Chips" className="player-chips" />
                    </div>
                    <div className="player-details">
                        <p className="player-name">
                            {player.name} <span className="player-money">${player.money}</span>
                        </p>
                    </div>
                </div>

                {/* Render player cards */}
                <div className="player-cards">
                    {player.cards.map((card, cardIndex) => (
                        <img key={cardIndex} src={card} alt="Card" className="player-card" />
                    ))}
                </div>
            </div>
        ));
    };

    const renderCommunityCards = () => {
        return (
            <div className="community-cards">
                {communityCards.map((card, index) => (
                    <img key={index} src={card} alt="Community Card" className="community-card" />
                ))}
            </div>
        );
    };

    return (
        <div className="poker-table">
            {/* Render the poker table */}
            <img src="/src/assets/table.svg" alt="Poker Table" className="poker-table-image" />

            {/* Render players */}
            {renderPlayers()}

            {/* Render community cards */}
            {renderCommunityCards()}
        </div>
    );
}
