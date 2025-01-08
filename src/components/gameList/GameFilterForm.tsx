import {SubmitHandler, useForm} from "react-hook-form";
import {useContext, useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Collapse,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {Game} from "../../model/Game.ts";
import {GameFilterFormInputs} from "./forminput/GameFilterFormInputs";
import {usePlayersOnMove} from "../../hooks/usePlayer";
import SecurityContext from "../../context/SecurityContext";
import Loader from "../loader/Loader";

interface FilterFormProps {
    games: Game[];
    onFilteredGames: (games: Game[]) => void;
    resetPage: () => void;
}

export default function GameFilterForm({ games, onFilteredGames, resetPage }: FilterFormProps) {
    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm<GameFilterFormInputs>({defaultValues: {
        hasTimer: false,
    }
});
    const [filterType, setFilterType] = useState<string>("name");
    const [expanded, setExpanded] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [hasTimer, setHasTimer] = useState<boolean | undefined>(undefined);
    const [isOnMoveFilter, setIsOnMoveFilter] = useState<boolean>(false);
    const {isLoading, isError, playersOnMove} = usePlayersOnMove();
    const [filtersApplied, setFiltersApplied] = useState(false);


    const { username } = useContext(SecurityContext);

    useEffect(() => {
        setValue("hasTimer", hasTimer);
    }, [hasTimer, setValue]);

    const applyFilters = () => {

        let filtered = games;

        const values = getValues();

        let filtersChanged = false;

        if (values.name) {
            filtered = filtered.filter(game => game.name.toLowerCase().includes(values.name.toLowerCase()));
            filtersChanged = true;
        }

        if (values.maxPlayers) {
            filtered = filtered.filter(game => game.maxPlayers === values.maxPlayers);
            filtersChanged = true;
        }

        if (values.status) {
            filtered = filtered.filter(game => game.status === values.status);
            filtersChanged = true;
        }

        if (getValues("hasTimer") !== undefined) {
            filtered = filtered.filter(game => game.settings.timer === getValues("hasTimer"));
            filtersChanged = true;
        }

        if (isOnMoveFilter) {
            filtered = filtered.filter(game => {
                const entry = playersOnMove?.find(entry => entry.gameId === game.id);
                if (!entry?.playerOnMove) {
                    return false;
                }
                const playerOnMove = entry.playerOnMove.username;
                return playerOnMove === username;
            });
            filtersChanged = true;
        }

        onFilteredGames(filtered);
        resetPage();
        setFiltersApplied(filtersChanged);
    };

    useEffect(() => {
        applyFilters();
    }, [isOnMoveFilter])

    if (isLoading) return <Loader>Loading games...</Loader>;
    if (isError) return <Alert severity="error">Error loading games</Alert>;

    const onSubmit: SubmitHandler<GameFilterFormInputs> = () => {
        try {
            applyFilters();
        } catch (error) {
            console.error(error);
        }
    };

    const onClearFilters = () => {
        reset({
            name: "",
            maxPlayers: 0,
            status: "",
            hasTimer: undefined,
        });
        setFilterType("name");
        setIsOnMoveFilter(false);
        setHasTimer(undefined);
        setFiltersApplied(false);
        onFilteredGames(games);
        resetPage();
    };



    const glowStyle = {
        position: "absolute" as const,
        inset: "-1rem",
        background: "#3b82f6",
        opacity: 0.3,
        borderRadius: "50%",
        filter: "blur(3rem)",
        animation: "pulse 1s infinite",
    };

    const formContainerStyle = {
        position: "relative" as const,
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "15px",
        padding: "20px",
        backgroundColor: "rgba(26, 32, 44, 0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "white",
        fontFamily: "'Kalam', sans-serif",
        overflow: "hidden",
        marginTop: "25px",
    };

    const fieldStyle = {
        marginBottom: "15px",
        borderRadius: "8px",
        color: "white",
        backgroundColor: "rgba(26, 32, 44, 0.6)"
    };

    const renderActiveFilters = () => {
        if (!filtersApplied) return null;

        const activeFilters: { label: string; key: string }[] = [];

        const values = getValues();

        if (values.name) activeFilters.push({ label: `Name: ${values.name}`, key: "name" });
        if (values.maxPlayers > 0) activeFilters.push({ label: `Max Players: ${values.maxPlayers}`, key: "maxPlayers" });
        if (values.status && values.status !== "") activeFilters.push({ label: `Status: ${values.status}`, key: "status" });
        if (hasTimer !== undefined) activeFilters.push({ label: `Timer: ${hasTimer ? "Yes" : "No"}`, key: "hasTimer" });
        if (isOnMoveFilter) activeFilters.push({ label: "Player: On Move", key: "isOnMoveFilter" });

        const handleDeleteFilter = (key: string) => {
            switch (key) {
                case "name":
                    setValue("name", "");
                    break;
                case "maxPlayers":
                    setValue("maxPlayers", 0);
                    break;
                case "status":
                    setStatus("");
                    setValue("status", "")
                    break;
                case "hasTimer":
                    setHasTimer(undefined);
                    setValue("hasTimer", undefined)
                    break;
                case "isOnMoveFilter":
                    setIsOnMoveFilter(false);
                    break;
                default:
                    break;
            }

            applyFilters();
            resetPage();
        };

        return activeFilters.length > 0 ? (
            <Box>
                <Typography variant="h6" style={{ marginTop: "15px", fontFamily: "'Kalam', sans-serif" }}>
                    Active Filters:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                    {activeFilters.map((filter, index) => (
                        <Chip
                            key={index}
                            label={filter.label}
                            onDelete={() => handleDeleteFilter(filter.key)}
                            style={{ backgroundColor: "#3b82f6", color: "white" }}
                        />
                    ))}
                </Box>
            </Box>
        ) : null;
    };


    return (
        <Box style={formContainerStyle}>
            <div style={glowStyle}></div>

            <Typography variant="h6" style={{ marginBottom: "0px", fontFamily: "'Kalam', sans-serif", textAlign: "center" }}>
                Filter Games
            </Typography>

            <IconButton
                onClick={() => setExpanded(!expanded)}
                style={{
                    marginBottom: "15px",
                    color: "white",
                    justifyContent: "center",
                    fontSize: "24px",
                }}
            >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>

            <Collapse in={expanded}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth style={{ marginBottom: "15px" }}>
                        <InputLabel
                            id="filter-type-label"
                            sx={{
                                color: 'white',
                            }}
                        >
                            Filter Type
                        </InputLabel>
                        <Select
                            labelId="filter-type-label"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={fieldStyle}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                value="name"
                                sx={{
                                    backgroundColor: filterType === 'name' ? "rgba(26, 32, 44, 0.6)" : 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#3b82f6',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#90caf9',
                                        color: 'black',
                                    },
                                }}
                            >
                                Filter by Name
                            </MenuItem>
                            <MenuItem
                                value="playerCount"
                                sx={{
                                    backgroundColor: filterType === 'playerCount' ? "rgba(26, 32, 44, 0.6)" : 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#3b82f6',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#90caf9',
                                        color: 'black',
                                    },
                                }}
                            >
                                Filter by Max Players
                            </MenuItem>
                            <MenuItem
                                value="status"
                                sx={{
                                    backgroundColor: filterType === 'status' ? "rgba(26, 32, 44, 0.6)" : 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#3b82f6',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#90caf9',
                                        color: 'black',
                                    },
                                }}
                            >
                                Filter by Status
                            </MenuItem>
                            <MenuItem
                                value="settings"
                                sx={{
                                    backgroundColor: filterType === 'settings' ? "rgba(26, 32, 44, 0.6)" : 'transparent',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#3b82f6',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#90caf9',
                                        color: 'black',
                                    },
                                }}
                            >
                                Filter by Timer
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {filterType === "name" && (
                        <TextField
                            label="Game Name"
                            {...register("name")}
                            fullWidth
                            style={fieldStyle}
                            slotProps={{
                                input: {
                                    style: {
                                        color: "white",
                                    },
                                },
                            inputLabel: {
                                style: {
                                    color: "rgba(255, 255, 255, 0.7)",
                                },
                            },
                        }}
                        />
                    )}

                    {filterType === "playerCount" && (
                        <TextField
                            label="Max Players"
                            type="number"
                            {...register("maxPlayers", {
                                valueAsNumber: true,
                                min: { value: 2, message: 'Minimum players should be 2' },
                                max: { value: 6, message: 'Maximum players should be 6 or lower' },
                            })}
                            fullWidth
                            error={!!errors.maxPlayers}
                            helperText={errors.maxPlayers?.message}
                            style={fieldStyle}
                            slotProps={{
                                input: {
                                    style: {
                                        color: "white",
                                    },
                                },
                                inputLabel: {
                                    style: {
                                        color: "rgba(255, 255, 255, 0.7)",
                                    },
                                },
                            }}
                        />
                    )}

                    {filterType === "status" && (
                        <FormControl fullWidth style={{ marginBottom: "15px" }}>
                            <InputLabel
                                id="status-label"
                                sx={{
                                    color: "white",
                                    "&.Mui-focused": {
                                        color: "white",
                                    },
                                }}
                            >
                                Game Status
                            </InputLabel>
                            <Select
                                labelId="status-label"
                                {...register("status")}
                                value={status || getValues("status") || ""}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setValue("status", e.target.value);
                                }}
                                style={fieldStyle}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            backgroundColor: "rgba(26, 32, 44, 0.9)",
                                            color: "white",
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="" disabled style={{ color: "gray" }}>
                                    Select a Status
                                </MenuItem>
                                <MenuItem value="WAITING">Waiting</MenuItem>
                                <MenuItem value="IN_PROGRESS">In progress</MenuItem>
                                <MenuItem value="FINISHED">Finished</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {filterType === "settings" && (
                        <FormControl fullWidth style={{ marginBottom: "15px" }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={hasTimer === true}
                                        onChange={(e) => {
                                            setHasTimer(e.target.checked);
                                            setValue("hasTimer", e.target.checked);
                                            applyFilters();
                                        }}
                                        name="hasTimer"
                                        color="primary"
                                    />
                                }
                                label={hasTimer ? "With Timer" : "No Timer"}
                            />
                        </FormControl>
                    )}
                    <Box
                        style={{
                            marginBottom: "15px",
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <label style={{ color: "white", userSelect: "none" }}>
                            Only games where you can make a move
                            <input
                                type="checkbox"
                                checked={isOnMoveFilter}
                                onChange={(e) => setIsOnMoveFilter(e.target.checked)}
                                style={{ marginLeft: "10px", cursor: "pointer" }}
                            />
                        </label>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{
                                marginTop: "10px",
                                borderRadius: "15px",
                            }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={onClearFilters}
                            variant="outlined"
                            color="error"
                            style={{
                                marginTop: "10px",
                                borderRadius: "15px",
                                marginLeft: "10px",
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </form>

                {renderActiveFilters()}
            </Collapse>
        </Box>
    );
}
