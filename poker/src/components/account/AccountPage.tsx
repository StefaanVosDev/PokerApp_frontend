import {
    Avatar,
    Typography,
    Paper,
    Box,
    Stack,
    Alert,
} from "@mui/material";
import {useAccount, useLoggedInAvatar} from "../../hooks/useAccount.ts";
import {useParams} from "react-router-dom";
import Loader from "../loader/Loader.tsx";
import "./AccountPage.scss";

function AccountPage() {
    const {username} = useParams();
    const {isLoading, isError, account} = useAccount(String(username));
    const {isLoadingAvatar, isErrorLoadingAvatar, avatar} = useLoggedInAvatar(() => true);

    const glowStyle = {
        position: "absolute" as const,
        inset: "-1rem",
        background: "#3b82f6",
        opacity: 0.3,
        borderRadius: "50%",
        filter: "blur(3rem)",
        animation: "pulse 1s infinite",
    };

    const paperStyle = {
        backgroundColor: "rgba(26, 32, 44, 0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        color: "white",
        fontFamily: "'Kalam', sans-serif",
        padding: "20px",
        borderRadius: "15px",
    };

    if (isLoading) return <Loader>loading account...</Loader>
    if (isLoadingAvatar) return <Loader>loading avatar...</Loader>
    if (isError || !account) return <Alert severity="error" variant="filled">Error loading account!</Alert>
    if (isErrorLoadingAvatar || !avatar) return <Alert severity="error" variant="filled">Error loading data!</Alert>

    return (
        <div
            style={{
                backgroundColor: "#000000",
                minHeight: "100vh",
                paddingTop: "80px",
                fontFamily: "'Kalam', sans-serif",
                color: "#FFFFFF",
                position: "relative",
            }}
        >
            <Stack spacing={4} alignItems="center">

                <Box
                    sx={{
                        position: "relative",
                        display: "inline-block",
                        borderRadius: "15px",
                        overflow: "hidden",
                        width: "100%",
                        maxWidth: "900px",
                    }}
                >
                    <div style={glowStyle} className="background-blur"></div>
                    <Paper
                        elevation={3}
                        style={{
                            ...paperStyle,
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                                <Avatar
                                    alt="User Avatar"
                                    src={avatar?.image}
                                    sx={{width: 80, height: 80}}
                                />
                                <Box>
                                    <Typography variant="h5">{account?.username}</Typography>
                                    <Typography variant="body1" style={{opacity: 0.8}}>
                                        {account?.email}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography variant="body1">Name: {account?.name}</Typography>
                            <Typography
                                variant="body1">Age: {new Date(account?.age).toLocaleDateString()}</Typography>
                            <Typography variant="body1">City: {account?.city}</Typography>
                            <Typography variant="body1">Gender: {account?.gender}</Typography>
                        </Stack>



                        <Typography
                            variant="h6"
                            style={{
                                fontFamily: "'Kalam', sans-serif",
                                color: "#3b82f6",
                                marginBottom: "10px",
                                textAlign: "center",
                            }}
                        >
                            Owned Avatars
                        </Typography>

                        {account?.ownedAvatars && account.ownedAvatars.length > 0 ? (
                            <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
                                {account.ownedAvatars.map((avatarItem, index) => (
                                    <Box key={index} textAlign="center">
                                        <Avatar
                                            src={avatarItem.image}
                                            alt={avatarItem.name}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                border: `2px solid #3b82f6`,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            style={{
                                                fontFamily: "'Kalam', sans-serif",
                                                marginTop: "5px",
                                            }}
                                        >
                                            {avatarItem.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                variant="body1"
                                style={{
                                    fontFamily: "'Kalam', sans-serif",
                                    opacity: 0.8,
                                }}
                            >
                                No avatars owned yet.
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </Stack>
        </div>
    );
}

export default AccountPage;
