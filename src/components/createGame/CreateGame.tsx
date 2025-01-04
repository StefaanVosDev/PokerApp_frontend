import {useForm} from 'react-hook-form';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import './CreateGame.scss';
import {CreateGameFormInputs} from './forminput/CreateGameFormInputs.ts';
import {useNavigate} from "react-router-dom";
import {useCreateGame} from "../../hooks/useGame.ts";
import {useState} from "react";
import Loader from "../loader/Loader.tsx";
import {Game} from "../../model/Game.ts";

export default function CreateGame() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, watch} = useForm<CreateGameFormInputs>();
    const {createGame, isPending, error} = useCreateGame();
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [responseData, setResponseData] = useState<Game | null>(null);

    if (isPending) {
        return <Loader>Loading...</Loader>;
    }

    const smallBlind = watch('settings.smallBlind');
    const startingChips = watch('settings.startingChips');

    const onSubmit = (data: CreateGameFormInputs) => {
        createGame(data, {
            onSuccess: (responseData) => {
                setResponseData(responseData)
                setIsConfirmationDialogOpen(true);
            }
        });
    };

    const handleCloseConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
        navigate(-1);
    };

    const handleGoToGame = () => {
        setIsConfirmationDialogOpen(false);
        if (responseData)
            navigate('/game/'+responseData.id)
    }

    const handleGoLobby = () => {
        setIsConfirmationDialogOpen(false);
        navigate('/games');
    };

    return (
        <Box className="create-game-container" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '3rem',
            backgroundColor: 'black',
            color: 'white',
            fontFamily: 'Kalam, sans-serif',
            minHeight: '100vh',
        }}>
            <Button
                sx={{
                    position: 'absolute',
                    top: '8.5rem',
                    left: '3rem',
                    zIndex: 10,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontFamily: 'Kalam, sans-serif',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#45a049',
                    },
                }}
                variant="contained"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
            <Typography variant="h4" component="h1" sx={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                color: 'white',
                fontFamily: 'Kalam, sans-serif',
                marginTop: '1rem',
            }}>
                Create a New Game
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="create-game-form">
                <TextField
                    {...register('name', {required: 'Game name is required'})}
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
                        min: {value: 2, message: 'Minimum players should be 2'},
                        max: {value: 6, message: 'Maximum players should be 6 or lower'},
                    })}
                    label="Max Players"
                    type="number"
                    variant="outlined"
                    fullWidth
                    error={!!errors.maxPlayers}
                    helperText={errors.maxPlayers?.message}
                    className="create-game-input"
                />

                <TextField
                    {...register('settings.smallBlind', {
                        required: 'Small blind is required',
                        valueAsNumber: true,
                        min: {value: 1, message: 'Minimum small blind should be $1'},
                        validate: (value) =>
                            startingChips
                                ? value <= startingChips / 8 || 'Small blind cannot exceed 1/8 of starting chips'
                                : true
                    })}
                    label="Small Blind"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={5}
                    error={!!errors.settings?.smallBlind}
                    helperText={errors.settings?.smallBlind?.message}
                    className="create-game-input"
                />

                <TextField
                    {...register('settings.bigBlind', {
                        required: 'Big blind is required',
                        valueAsNumber: true,
                        min: {value: 2, message: 'Minimum big blind should be $2'},
                        validate: (value) => {
                            if (smallBlind && value <= smallBlind) {
                                return 'Big blind must be larger than small blind';
                            }
                            if (startingChips && value > startingChips / 4) {
                                return 'Big blind cannot exceed 1/4 of starting chips';
                            }
                            return true;
                        },
                    })}
                    label="Big Blind"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={10}
                    error={!!errors.settings?.bigBlind}
                    helperText={errors.settings?.bigBlind?.message}
                    className="create-game-input"
                />


                <div className="create-game-input switch-container">
                    <FormControlLabel
                        control={
                            <Switch
                                {...register('settings.timer')}
                                defaultChecked={false}
                            />
                        }
                        label="Timer"
                        className="switch-label"
                    />
                </div>

                <TextField
                    {...register('settings.startingChips', {
                        required: 'Starting chips are required',
                        valueAsNumber: true,
                        min: {value: 8, message: 'Minimum starting chips should be $8'},
                    })}
                    label="Starting Chips"
                    type="number"
                    variant="outlined"
                    fullWidth
                    defaultValue={1000}
                    error={!!errors.settings?.startingChips}
                    helperText={errors.settings?.startingChips?.message}
                    className="create-game-input"
                />

                {error && <Alert severity="error">{error.message}</Alert>}

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

            <Dialog
                open={isConfirmationDialogOpen}
                onClose={handleCloseConfirmationDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        fontFamily: "Kalam, sans-serif",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                        color: "white",
                    }}
                >
                    Game Created Successfully
                </DialogTitle>
                <DialogContent>
                    <Typography
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        Your game has been created successfully. What would you like to do next?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleGoToGame()}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Go to Game
                    </Button>
                    <Button
                        onClick={() => handleGoLobby()}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Lobby
                    </Button>
                    <Button
                        onClick={() => setIsConfirmationDialogOpen(false)}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
