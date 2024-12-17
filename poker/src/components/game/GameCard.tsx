import {Card, CardContent, Typography} from "@mui/material";
import {Game} from "../../model/Game.ts";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {getStatusColor} from "../../services/gameService.ts";

interface GameCardProps {
    onClick: () => void;
    game: Game;
}

export function GameCard({onClick, game}: GameCardProps) {

    const currentPlayers = game.players.length;
    const statusColor = getStatusColor(game.status);

    return <Card
        className="game-card"
        key={game.id}
        onClick={onClick}
        style={{borderLeft: `5px solid ${statusColor}`}} // Add color to the card's left border
    >
        <CardContent>
            <Typography variant="h6">
                {game.name}
            </Typography>
            <Typography variant="body2" className="game-players">
                Players: {currentPlayers}/{game.maxPlayers}
            </Typography>
            <Typography
                variant="body2"
                className="game-status"
                style={{color: statusColor}}
            >
                {game.status === 'FINISHED' && game.players.some(player => player.isWinner)
                    ? `Status: ${game.status}, Winner: ${game.players.find(player => player.isWinner)?.username}`
                    : `Status: ${game.status}`}
            </Typography>
            <Typography variant="h6" className="settings-display">
                Settings
            </Typography>

            <div className="game-settings-container">
                <Typography variant="body2" className="game-setting">
                    small blind: ${game.settings.smallBlind}
                </Typography>
                <Typography variant="body2" className="game-setting">
                    big blind: ${game.settings.bigBlind}
                </Typography>
                <Typography variant="body2" className="game-setting">
                    starting chips: ${game.settings.startingChips}
                </Typography>
                <Typography variant="body2" className="game-setting">
                    timer: {game.settings.timer ? <CheckCircle color="success"/> : <Cancel color="error"/>}
                </Typography>
            </div>
        </CardContent>
    </Card>
}
