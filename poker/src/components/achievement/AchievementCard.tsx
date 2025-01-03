import { Card, CardContent, Typography, Box } from "@mui/material";
import Achievement from "../../model/Achievement.ts";

interface AchievementCardProps {
    achievement: Achievement;
    isObtained: boolean | undefined;
}

const glowStyle = {
    position: "absolute" as const,
    inset: "-1rem",
    background: "#3b82f6",
    opacity: 0.3,
    borderRadius: "50%",
    filter: "blur(3rem)",
    animation: "pulse 1s infinite",
};

function AchievementCard({ achievement, isObtained }: AchievementCardProps) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-block",
                borderRadius: "15px",
                overflow: "hidden",
                width: "300px",
                height: "150px",
                margin: "10px",
            }}
        >
            <div style={glowStyle}></div>
            <Card
                sx={{
                    width: "100%",
                    height: "100%",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "15px",
                    padding: "15px",
                    backgroundColor: "rgba(26, 32, 44, 0.6)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: "white",
                    fontFamily: "'Kalam', sans-serif",
                    borderLeft: `5px solid ${isObtained ? "gold" : "gray"}`,
                    opacity: isObtained ? 1 : 0.5,
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "left",
                        height: "100%",
                        padding: "0",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: "22px",
                            marginBottom: "5px",
                        }}
                    >
                        {achievement.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "15px",
                            color: "#ccc",
                            marginBottom: "10px",
                        }}
                    >
                        {achievement.description}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            margin: 0,
                        }}
                    >
                        Pokerpoints gained: {achievement.pokerPoints}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AchievementCard;
