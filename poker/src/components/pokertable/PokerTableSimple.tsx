import './PokerTable.scss';
import Player from "../../model/Player.ts";
import {PlayingCard} from "../../model/PlayingCard.ts";
import {Turn} from "../../model/Turn.ts";

interface PokerTableProps {
    players: (Player & { cards: string[] })[]; // Players with cards as image paths
    communityCards: PlayingCard[]; // Array of card image paths for the community cards
    turns: Turn[];
}

const playerPositions = [
    { top: '20%', left: '80%' },
    { top: '58%', left: '92%' },
    { top: '80%', left: '72%' },
    { top: '80%', left: '28%' },
    { top: '58%', left: '8%' },
    { top: '20%', left: '23%' },

];

export default function PokerTableSimple({ players, communityCards, turns }: PokerTableProps) {

    const renderPlayers = () => {
        return players.slice(0, 6).map((player, index) => {
            const turnsFromPlayer =  turns.filter(turn => turn.player.id == player.id);
            const moneyGambledThisPhase = turnsFromPlayer.map(turn => turn.moneyGambled).reduce((sum, money) => sum + money, 0);

            const turn = turnsFromPlayer[turnsFromPlayer.length - 1];

            const playerMove = turn ? (turn.moveMade + "  " + (moneyGambledThisPhase == 0 ? "" : moneyGambledThisPhase)) : "Waiting...";
            const hasFolded = turn?.moveMade === "FOLD";

            return (
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
                            <img src="/src/assets/duckpfp.png" alt="Duck Avatar" className={`player-avatar ${turn?.moveMade === "ON_MOVE" ? "active" : ""}`}/>
                            <img src="/src/assets/chips.svg" alt="Chips" className="player-chips"/>
                        </div>
                        <div className="player-details">
                            <p className="player-name">
                                Placeholder Name <span className="player-money">${player.money}</span>
                            </p>
                        </div>
                    </div>

                    <div className="player-move">
                        <span>{playerMove}</span>
                    </div>

                    <div className={`player-cards ${hasFolded ? "folded" : ""}`}>
                        {player.cards.map((card, cardIndex) => (
                            <img key={cardIndex} src={card} alt="Card" className="player-card"/>
                        ))}
                    </div>
                </div>
            );
        });
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
