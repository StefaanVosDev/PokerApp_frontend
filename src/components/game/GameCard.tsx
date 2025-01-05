import {Alert, Box, Card, CardContent, Typography} from "@mui/material";
import {Game} from "../../model/Game.ts";
import {Cancel, CheckCircle} from "@mui/icons-material";
import {getStatusColor} from "../../services/gameService/gameService.ts";
import {usePlayerOnMove} from "../../hooks/usePlayer";
import Loader from "../loader/Loader.tsx";

interface GameCardProps {
    onClick: () => void;
    game: Game;
}

export function GameCard({onClick, game}: GameCardProps) {

    const currentPlayers = game.players.length;
    const statusColor = getStatusColor(game.status);
    const {isLoading, isError, player} = usePlayerOnMove(game.id);

    if (isLoading)
        return <Loader>Loading...</Loader>;
    if (isError)
        return <Alert severity="error" variant="filled">Error player on move </Alert>;

    return <Card
        className="game-card"
        sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s',
            backgroundColor: '#1e1e1e',
            color: 'white',
            fontFamily: 'Kalam, sans-serif',
            padding: '1rem',
            borderRadius: '8px',
            '&:hover': {
                transform: 'scale(1.05)',
            },
            '.MuiCardContent-root': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            '.MuiTypography-h6': {
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
            },
            '.MuiTypography-body2': {
                fontSize: '1rem',
            },
            borderLeft: `5px solid ${statusColor}`
        }}
        key={game.id}
        onClick={onClick}
        style={{borderLeft: `5px solid ${statusColor}`}} // Add color to the card's left border
    >
        <CardContent>
            <Typography sx={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                fontFamily: 'Kalam, sans-serif'
            }}>
                {game.name}
            </Typography>
            <Typography sx={{
                marginBottom: '1rem',
                fontFamily: 'Kalam, sans-serif',
            }} variant="body2">
                Players: {currentPlayers}/{game.maxPlayers}
            </Typography>
            <Typography
                sx={{
                    marginTop: '0.5rem',
                    fontFamily: 'Kalam, sans-serif',
                    color: statusColor
                }}
                variant="body2"
                className="game-status"
                style={{color: statusColor}}
            >
                {game.status === 'FINISHED' && game.players.some(player => player.isWinner)
                    ? `Status: ${game.status.replace("_", " ")}, Winner: ${game.players.find(player => player.isWinner)?.username}`
                    : `Status: ${game.status.replace("_", " ")}`}
            </Typography>
            <Typography sx={{
                marginTop: '0.5rem',
                fontFamily: 'Kalam, sans-serif'
            }} variant="body2">
                {game.status === 'IN_PROGRESS' && player?.username ? `Make a move!  ${player.username}` : ''}
            </Typography>
            <Typography sx={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                marginTop: '1rem',
                fontFamily: 'Kalam, sans-serif'
            }}>
                Settings
            </Typography>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                '& > *': {
                    fontFamily: 'Kalam, sans-serif',
                    margin: 0,
                    whiteSpace: 'nowrap',
                }

            }}>
                <Typography variant="body2">
                    small blind: ${game.settings.smallBlind}
                </Typography>
                <Typography variant="body2">
                    big blind: ${game.settings.bigBlind}
                </Typography>
                <Typography variant="body2">
                    starting chips: ${game.settings.startingChips}
                </Typography>
                <Typography variant="body2">
                    timer:
                </Typography>
                <Typography variant="body2">
                    {game.settings.timer ? <CheckCircle color="success"/> : <Cancel color="error"/>}
                </Typography>
            </Box>
        </CardContent>
    </Card>
}
