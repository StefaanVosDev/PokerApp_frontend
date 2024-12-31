import {Alert, Avatar, Box, Button, Paper, Stack, Typography,} from "@mui/material";
import {useAccount, useLoggedInAvatar, useSelectAvatar} from "../../hooks/useAccount.ts";
import {useParams} from "react-router-dom";
import Loader from "../loader/Loader.tsx";
import "./AccountPage.scss";
import {useContext, useEffect, useState} from "react";
import SecurityContext from "../../context/SecurityContext.ts";

function AccountPage() {
    const {username} = useParams();
    const {isLoading, isError, account} = useAccount(String(username));
    const {isAuthenticated} = useContext(SecurityContext)
    const {isLoadingAvatar, isErrorLoadingAvatar, avatar} = useLoggedInAvatar(isAuthenticated);
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const {
        isSelectingAvatar,
        isErrorSelectingAvatar,
        isSuccessSelectingAvatar,
        triggerSelectAvatar
    } = useSelectAvatar(String(username), selectedAvatarId);
    const isMyAccount = String(username) === avatar?.username;

    useEffect(() => {
        if (isSuccessSelectingAvatar) setSelectedAvatarId(null)
    }, []);

    if (isLoading) return <Loader>loading account...</Loader>
    if (isLoadingAvatar) return <Loader>loading avatar...</Loader>
    if (isSelectingAvatar) return <Loader>selecting avatar...</Loader>
    if (isError || !account) return <Alert severity="error" variant="filled">Error loading account!</Alert>
    if (isErrorLoadingAvatar || !avatar) return <Alert severity="error" variant="filled">Error loading data!</Alert>
    if (isErrorSelectingAvatar || !triggerSelectAvatar) return <Alert severity="error" variant="filled">Error selecting
        avatar!</Alert>

    function handleSelect(selectedAvatarId: string) {
        setSelectedAvatarId(selectedAvatarId)
        triggerSelectAvatar()
    }

    return (
        <div className="account-container">
            <Stack spacing={4} alignItems="center">
                {/* Merged Account Details and Owned Avatars */}
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
                    <div className="background-blur glow"></div>
                    <Paper
                        elevation={3}
                        sx={{
                            backgroundColor: "rgba(26, 32, 44, 0.6)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            color: "white",
                            fontFamily: "'Kalam', sans-serif",
                            padding: "20px",
                            borderRadius: "15px",
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                                <Avatar
                                    alt="User Avatar"
                                    src={account.activeAvatar!.image}
                                    sx={{width: 80, height: 80}}
                                />
                                <Box>
                                    <Typography variant="h5">{account?.username}</Typography>
                                    <Typography variant="body1" sx={{opacity: 0.8}}>
                                        {account?.email}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography variant="body1">Name: {account?.name}</Typography>
                            <Typography
                                variant="body1">Age: {new Date(account?.age).toLocaleDateString()}</Typography>
                            {isMyAccount && <Typography variant="body1">City: {account?.city}</Typography>}
                            <Typography variant="body1">Gender: {account?.gender}</Typography>
                        </Stack>


                        {/* Owned Avatars */}
                        <Typography
                            variant="h6"
                            sx={{
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
                                            sx={{
                                                fontFamily: "'Kalam', sans-serif",
                                                marginTop: "5px",
                                            }}
                                        >
                                            {avatarItem.name}
                                        </Typography>
                                        {/*check if the page is  being visited by the logged in user or a friend*/}
                                        {isMyAccount &&
                                            (avatarItem.id === avatar.id ? (
                                                    <Button
                                                        disabled={true}
                                                        sx={{
                                                            backgroundColor: 'grey',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '10px 15px',
                                                            cursor: 'not-allowed',
                                                            marginTop: '10px'
                                                        }}
                                                    >
                                                        Selected
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleSelect(avatarItem.id)}
                                                        sx={{
                                                            backgroundColor: 'blue',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '10px 15px',
                                                            cursor: 'pointer',
                                                            marginTop: '10px'
                                                        }}
                                                    >
                                                        Select
                                                    </Button>
                                                )
                                            )}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                variant="body1"
                                sx={{
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
