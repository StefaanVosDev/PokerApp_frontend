import { useContext, useState } from "react";
import {
    Box,
    Drawer,
    IconButton,
    List,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import SecurityContext from "../../context/SecurityContext.ts";
import { useFriends } from "../../hooks/useAccount.ts";
import FriendCard from "./FriendCard";

export default function FriendsList() {
    const { username } = useContext(SecurityContext);
    const [isOpen, setIsOpen] = useState(false);
    const { isLoading, isError, friends } = useFriends(username);

    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>

            <IconButton onClick={toggleDrawer} color="inherit" sx={{ ml: 2, color: "white" }}>
                <GroupIcon />
                <Typography sx={{ marginLeft: 1, fontFamily: "Kalam" }}>Friends</Typography>
            </IconButton>


            <Drawer
                anchor="right"
                open={isOpen}
                onClose={toggleDrawer}
                slotProps={{
                    backdrop: { invisible: true },
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.6)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        color: "white",
                        width: 300,
                        fontFamily: "Kalam, sans-serif",
                    },
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        Your Friends
                    </Typography>
                    <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Friends Content */}
                <Box sx={{ padding: "1rem", flex: 1, overflowY: "auto" }}>
                    {isLoading ? (
                        <Typography>Loading...</Typography>
                    ) : isError ? (
                        <Typography color="error">Failed to fetch friends.</Typography>
                    ) : !friends || friends.length === 0 ? (
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
            </Drawer>
        </>
    );
}
