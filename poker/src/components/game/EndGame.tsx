import {Alert, Box, Button, Container, Typography} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";
import {useWinner} from "../../hooks/usePlayer.ts";

function EndGame() {
    const {winnerId} = useParams<{ winnerId: string }>();
    const navigate = useNavigate();

    const {isLoading, isError, winner} = useWinner(winnerId);

    if (isLoading)
        return <div>Loading winner data...</div>;
    if (isError)
        return <Alert severity="error">Error loading winner data...</Alert>

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography variant="h3" gutterBottom>Game Over</Typography>
            {winner &&
                <>
                    <Box className="winner-info" mb={4}>
                        <img src="/src/assets/duckpfp.png" alt={`${winner.username}'s avatar`}
                             style={{borderRadius: '50%', width: '150px', height: '150px'}}/>
                        <Typography variant="h4" gutterBottom>Congratulations {winner.username}</Typography>
                        <Typography variant="h5">Winning with ${winner.money}</Typography>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleGoHome}>
                        Go to Home
                    </Button>
                </>
            }
        </Container>
    );
}

export default EndGame;