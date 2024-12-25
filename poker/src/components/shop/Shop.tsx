import {useAvatars, useBuyAvatar, usePokerPoints} from "../../hooks/useAccount.ts";
import {Avatar} from "../../model/Avatar.ts";
import "./Shop.scss";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";

function Shop() {
    const {isLoadingAvatars, isErrorAvatars, avatars, refetchAvatars} = useAvatars();
    const {isPendingBuyAvatar, isErrorBuyAvatar, isSuccessBuyAvatar, triggerBuyAvatar} = useBuyAvatar();
    const {isLoadingPokerPoints, isErrorPokerPoints, pokerPoints, refetchPokerPoints} = usePokerPoints();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isSuccessBuyAvatar) {
            refetchAvatars();
            refetchPokerPoints();
        }
    }, [isSuccessBuyAvatar]);

    if (isLoadingAvatars) return <div>Loading...</div>;
    if (isErrorAvatars) return <div>Error...</div>;
    if (isPendingBuyAvatar) return <div>Buying...</div>;
    if (isErrorBuyAvatar) return <div>Error buying...</div>;
    if (isLoadingPokerPoints) return <div>Loading poker points...</div>;
    if (isErrorPokerPoints) return <div>Error loading poker points...</div>;

    function handleBuyAvatar(avatar: Avatar) {
        if (pokerPoints !== undefined && pokerPoints < avatar.price) {
            setIsOpen(true);
            return;
        }
        triggerBuyAvatar(avatar);
    }

    const handleClose = () => {
        setIsOpen(false);
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
                    marginTop: "30px",
                }}
            >
                {avatars &&
                    avatars.map((avatar: Avatar) => (
                        <Box
                            key={avatar.name}
                            className="avatar-item"
                            flex="0 1 calc(33.333% - 16px)"
                        >
                            <Card
                                className="avatar-card"
                                sx={{
                                    backgroundColor: "rgba(26, 32, 44, 0.6)",
                                    backdropFilter: "blur(10px)",
                                    WebkitBackdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    transition:
                                        "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                                    },
                                    textAlign: "center",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={avatar.image}
                                    alt={avatar.name}
                                    className="avatar-image"
                                />
                                <CardContent
                                    className="avatar-content"
                                    sx={{
                                        backgroundColor: "rgba(26, 32, 44, 0.8)",
                                        color: "#fff",
                                        fontFamily: "Kalam, sans-serif",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        className="avatar-name"
                                        sx={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            color: "#fff",
                                        }}
                                    >
                                        {avatar.name}
                                    </Typography>
                                    {avatar.isOwned ? (
                                        <Typography
                                            variant="body1"
                                            className="avatar-status"
                                            sx={{
                                                fontSize: "1rem",
                                                color: "#4caf50",
                                                marginTop: "10px",
                                            }}
                                        >
                                            Owned
                                        </Typography>
                                    ) : (
                                        <div className="avatar-action">
                                            <Typography
                                                variant="body1"
                                                className="avatar-price"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: "#2196f3",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                Price: {avatar.price} poker points
                                            </Typography>
                                            <Button
                                                onClick={() => handleBuyAvatar(avatar)}
                                                variant="contained"
                                                className="buy-button"
                                                sx={{
                                                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "rgba(59, 130, 246, 1)",
                                                    },
                                                }}
                                            >
                                                Buy
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
            </Box>

            <Dialog
                open={isOpen}
                onClose={handleClose}
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
                        onClick={handleClose}
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
        </div>
    );
}

export default Shop;
