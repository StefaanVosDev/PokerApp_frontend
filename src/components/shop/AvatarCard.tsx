import {Avatar} from "../../model/Avatar.ts";
import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";

interface AvatarCardProps {
    avatar: Avatar;
    handleBuyAvatar: (avatar: Avatar) => void;
}

function AvatarCard({ avatar, handleBuyAvatar}: AvatarCardProps) {
    return <Box
        key={avatar.name}
        className="avatar-item"
        sx={{
            flex: "0 1 calc(25% - 20px)",
            maxWidth: "calc(25% - 20px)",
            boxSizing: "border-box",
        }}
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
}

export default AvatarCard;