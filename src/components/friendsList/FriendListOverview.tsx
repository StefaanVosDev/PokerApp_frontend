import {Alert, Box, List, Typography} from "@mui/material";
import {useFriends} from "../../hooks/useAccount.ts";
import FriendCard from "./FriendCard.tsx";
import Loader from "../loader/Loader.tsx";

interface FriendListOverviewProps {
    username: string | undefined;
}

function FriendListOverview({ username }: FriendListOverviewProps) {
    const { isLoading, isError, friends } = useFriends(username);

    if (isLoading) return <Loader>Loading...</Loader>;
    if (isError) return <Alert severity="error" variant="filled">Error loading data!</Alert>;

    return (
        <Box sx={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
            {(!friends || friends.length === 0) ? (
                <Typography sx={{ textAlign: "center", opacity: 0.7 }}>
                    You have no friends, maybe you should find some :)
                </Typography>
            ) : (
                <List>
                    {friends.map((friend, index) => (
                        <FriendCard key={index} friend={friend} />
                    ))}
                </List>
            )}
        </Box>
    );
}

export default FriendListOverview;