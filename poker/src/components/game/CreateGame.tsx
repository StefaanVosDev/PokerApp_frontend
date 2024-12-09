import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Alert } from '@mui/material';
import { useCreateGame } from '../../hooks/useCreateGame';
import './CreateGame.scss';
import { CreateGameFormInputs } from './forminput/CreateGameFormInputs';
import {useNavigate} from "react-router-dom";

export default function CreateGame() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateGameFormInputs>();
    const { mutate, error } = useCreateGame();

    const onSubmit = (data: CreateGameFormInputs) => {
        mutate(data, {
            onSuccess: () => {
                reset();
                alert('Game created successfully!');
            },
            onError: (err: Error) => {
                console.error('Failed to create game:', err.message);
            },
        });
    };

    return (
        <div className="create-game-container">
            <Button
                className="back-button"
                variant="contained"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
            <Typography variant="h4" component="h1" className="create-game-title">
                Create a New Game
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="create-game-form">
                <TextField
                    {...register('name', { required: 'Game name is required' })}
                    label="Game Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    className="create-game-input"
                />

                <TextField
                    {...register('maxPlayers', {
                        required: 'Max players is required',
                        valueAsNumber: true,
                        min: { value: 2, message: 'Minimum players should be 2' },
                        max: { value: 6, message: 'Maximum players should be 6 or lower' },
                    })}
                    label="Max Players"
                    type="number"
                    variant="outlined"
                    fullWidth
                    error={!!errors.maxPlayers}
                    helperText={errors.maxPlayers?.message}
                    className="create-game-input"
                />

                {error && <Alert severity="error">{(error as Error).message}</Alert>}

                <div className="create-game-buttons">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {'Create Game'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
