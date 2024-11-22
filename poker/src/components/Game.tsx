import { useCommunityCards } from "../hooks/useCommunityCards.ts";
import Loader from "./Loader.tsx";
import { Alert, Box } from "@mui/material";
import PlayingCardDisplay from "./PlayingCardDisplay.tsx";
import {useParams} from "react-router-dom";

function Game() {
    const {id} = useParams<{ id: string }>();
    const { isLoading, isError, communityCards } = useCommunityCards(String(id));

    if (isLoading) return <Loader>Loading your cards...</Loader>;
    if (isError || !communityCards || communityCards.length === 0)
        return <Alert severity="error">Error loading cards</Alert>;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 4,
                gap: 2,
            }}
        >
            {communityCards.map((card) => (
                <PlayingCardDisplay key={card.id} card={card} height={150}/>
            ))}
        </Box>
    );
}

export default Game;
