import {Button} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";
import {useWinner} from "../../hooks/useWinner.ts";

function EndGame() {
    const {winnerId} = useParams<{ winnerId: string }>();
    const navigate = useNavigate();

    const {isLoading, isError, winner} = useWinner(winnerId);

    if (isLoading)
        return <div>Loading...</div>;
    if (isError)
        return <div>Error...</div>;

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="end-game">
            <h1>Game Over</h1>
            {winner &&
                <>
                    <div className="winner-info">
                        <img src="/src/assets/duckpfp.png" alt={`${winner.username}'s avatar`}/>
                        <h2>Congratulations, winning with {winner.money}!</h2>
                    </div>
                    <Button variant="contained" color="primary" onClick={handleGoHome}>
                        Go to Home
                    </Button>
                </>
            }
        </div>
    );
}

export default EndGame;