import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

interface FriendCardProps {
    friend: {
        username: string;
        image?: string;
    };
}

function FriendCard({ friend }: FriendCardProps) {
    return (
        <ListItem
            sx={{
                padding: "0.75rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    cursor: "pointer",
                },
            }}
        >

            <ListItemAvatar>
                <Avatar
                    src={friend.image || undefined}
                    sx={{
                        backgroundColor: !friend.image ? "#3b82f6" : undefined,
                        color: !friend.image ? "white" : undefined,
                    }}
                >
                    {!friend.image && friend.username.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>


            <ListItemText
                primary={friend.username}
                primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "white",
                }}
            />
        </ListItem>
    );
}

export default FriendCard;
