import {Alert, Box, List, Typography} from "@mui/material";
import {useFriends} from "../../hooks/useAccount.ts";
import FriendCard from "./FriendCard.tsx";
import {useEffect} from "react";
import Loader from "../loader/Loader.tsx";
import {useFriendRequests} from "../../hooks/useNotification.ts";
import FriendRequestDto from "../../model/dto/FriendRequestDto.ts";

interface FriendListOverviewProps {
    username: string | undefined;
    setNewFriendRequest: (request: FriendRequestDto) => void;
}

function FriendListOverview({ username, setNewFriendRequest }: FriendListOverviewProps) {
    const { isLoading, isError, friends } = useFriends(username);
    const { friendRequests, isLoadingFriendRequests, isErrorLoadingFriendRequests } = useFriendRequests(username);

    useEffect(() => {
        if (friendRequests && friendRequests.length > 0) {
            const tenSecondsAgo = new Date();
            tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

            const lastRequest = friendRequests.filter((request) => new Date(request.timestamp) > tenSecondsAgo);
            if (lastRequest && lastRequest.length > 0) setNewFriendRequest(friendRequests[0]);
        }
    }, [friendRequests]);

    if (isLoading || isLoadingFriendRequests) return <Loader>Loading...</Loader>;
    if (isError || isErrorLoadingFriendRequests) return <Alert severity="error" variant="filled">Error loading data!</Alert>;

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