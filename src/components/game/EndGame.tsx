import {Alert, Box, Button, Container, Typography} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";
import {useWinner} from "../../hooks/usePlayer.ts";
import Loader from "../loader/Loader.tsx";
import {useAccount} from "../../hooks/useAccount.ts";

function EndGame() {
    const {winnerId} = useParams<{ winnerId: string }>();
    const navigate = useNavigate();

    const {isLoading, isError, winner} = useWinner(winnerId);
    const {isLoading: isLoadingAccount, isError: isErrorLoadingAccount, account} = useAccount(winner?.username);

    if (isLoading)
        return <Loader>Loading winner data...</Loader>;
    if (isError)
        return <Alert severity="error">Error loading winner data...</Alert>
    if (isLoadingAccount) return <Loader>Loading avatar...</Loader>
    if (isErrorLoadingAccount) return <Alert severity="error" variant="filled">Error loading avatar!</Alert>

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography variant="h3" gutterBottom>Game Over</Typography>
            {winner && account?.activeAvatar &&
                <>
                    <Box className="winner-info" mb={4}>
                        <img src={account.activeAvatar.image} alt={`${winner.username}'s avatar`}
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