import {useAvatars, useBuyAvatar, usePokerPoints} from "../../hooks/useAccount.ts";
import {Avatar} from "../../model/Avatar.ts";
import "./Shop.scss";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import Loader from "../loader/Loader.tsx";
import AvatarCard from "./AvatarCard.tsx";

function Shop() {
    const {isLoadingAvatars, isErrorAvatars, avatars, refetchAvatars} = useAvatars();
    const {isPendingBuyAvatar, isErrorBuyAvatar, isSuccessBuyAvatar, triggerBuyAvatar} = useBuyAvatar();
    const {isLoadingPokerPoints, isErrorPokerPoints, pokerPoints, refetchPokerPoints} = usePokerPoints();
    const [isInsufficientPointsDialogOpen, setIsInsufficientPointsDialogOpen] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

    useEffect(() => {
        if (isSuccessBuyAvatar) {
            refetchAvatars();
            refetchPokerPoints();
        }
    }, [isSuccessBuyAvatar]);

    if (isLoadingAvatars) return <Loader>Loading...</Loader>;
    if (isErrorAvatars) return <Alert severity="error" variant="filled">Error...</Alert>;
    if (isPendingBuyAvatar) return <Loader>Buying...</Loader>;
    if (isErrorBuyAvatar) return <Alert severity="error" variant="filled">Error buying...</Alert>;
    if (isLoadingPokerPoints) return <Loader>Loading poker points...</Loader>;
    if (isErrorPokerPoints) return <Alert severity="error" variant="filled">Error loading poker points...</Alert>;

    function handleBuyAvatar(avatar: Avatar) {
        if (pokerPoints !== undefined && pokerPoints < avatar.price) {
            setIsInsufficientPointsDialogOpen(true);
            return;
        }
        setSelectedAvatar(avatar);
        setIsConfirmationDialogOpen(true);
    }

    const handleCloseInsufficientPointsDialog = () => {
        setIsInsufficientPointsDialogOpen(false);
    };

    const handleCloseConfirmationDialog = () => {
        setIsConfirmationDialogOpen(false);
        setSelectedAvatar(null);
    };

    const confirmPurchase = () => {
        if (selectedAvatar) {
            triggerBuyAvatar(selectedAvatar);
        }
        handleCloseConfirmationDialog();
    };

    return (
        <div className="shop-container">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                sx={{
                    padding: "10px 20px",
                }}
            >
                <Box
                    flex={1}
                    display="flex"
                    justifyContent="center"
                    sx={{
                        marginLeft: "200px",
                    }}
                >
                    <Typography
                        variant="h3"
                        className="shop-title"
                        sx={{
                            color: "#3b82f6",
                            fontFamily: "Kalam, sans-serif",
                            fontWeight: "bold",
                        }}
                    >
                        Avatar Shop
                    </Typography>
                </Box>
                <Typography
                    variant="h6"
                    className="poker-points"
                    sx={{
                        color: "#f5a623",
                        background: "rgba(26, 32, 44, 0.8)",
                        padding: "10px 15px",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        fontFamily: "Kalam, sans-serif",
                        fontWeight: "bold",
                    }}
                >
                    Poker Points: {pokerPoints}
                </Typography>
            </Box>

            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={4}
                className="avatar-list"
                sx={{
                    marginTop: "30px"
                }}
            >
                {avatars?.map((avatar: Avatar) => (
                    <AvatarCard avatar={avatar} handleBuyAvatar={handleBuyAvatar} key={avatar.id}/>
                ))}
            </Box>

            {/* Insufficient Points Dialog */}
            <Dialog
                open={isInsufficientPointsDialogOpen}
                onClose={handleCloseInsufficientPointsDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        borderRadius: "12px",
                        fontFamily: "Kalam, sans-serif",
                    },
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                    }}
                >
                    Insufficient Poker Points
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        You do not have enough poker points to buy this avatar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseInsufficientPointsDialog}
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

            {/* Confirmation Dialog */}
            <Dialog
                open={isConfirmationDialogOpen}
                onClose={handleCloseConfirmationDialog}
                aria-labelledby="confirmation-dialog-title"
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(26, 32, 44, 0.9)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                        borderRadius: "12px",
                        fontFamily: "Kalam, sans-serif",
                    },
                }}
            >
                <DialogTitle
                    id="confirm-dialog-title"
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontFamily: "Kalam, sans-serif",
                    }}
                >
                    Confirm Purchase
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: "Kalam, sans-serif",
                        }}
                    >
                        Are you sure you want to buy avatar{" "}
                        <strong>{selectedAvatar?.name}</strong> for {selectedAvatar?.price} poker points</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmationDialog}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        BACK
                    </Button>
                    <Button
                        onClick={confirmPurchase}
                        sx={{
                            fontFamily: "Kalam, sans-serif",
                            color: "#3b82f6",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        CONFIRM
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Shop;
