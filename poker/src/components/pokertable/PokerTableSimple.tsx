import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {PlayingCard} from "../../model/PlayingCard.ts";

interface PokerTableProps {
    players: (Player & { cards: string[] })[]; // Players with cards as image paths
    communityCards: PlayingCard[]; // Array of card image paths for the community cards
}

const playerPositions = [
    { top: '20%', left: '23%' },
    { top: '58%', left: '8%' },
    { top: '80%', left: '28%' },
    { top: '80%', left: '72%' },
    { top: '58%', left: '92%' },
    { top: '20%', left: '80%' },
];

export default function PokerTableSimple({ players, communityCards }: PokerTableProps) {




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
                    <img key={index} src={`/images/${card.suit.toString().toLowerCase()}_${card.rank}.png`} alt={`${card.suit.toString().toLowerCase()}_${card.rank}`} className="community-card" />
                ))}
            </div>
        );
    };

    return (
            <div className="poker-table">
                <img src="/src/assets/table.svg" alt="Poker Table" className="poker-table-image"/>

                {renderPlayers()}

                {renderCommunityCards()}
            </div>
    );
}
