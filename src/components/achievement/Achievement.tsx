import {useState} from "react";
import {useAccount, useAchievements, useAchievementsPerAccount} from "../../hooks/useAccount.ts";
import AchievementCard from "./AchievementCard";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Container,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loader from "../loader/Loader";

interface AchievementProps {
    username: string | undefined;
}

function Achievement({ username }: AchievementProps) {
    const { achievements, isLoadingAchievements, isErrorAchievements } = useAchievements();
    const { account,isError, isLoading } = useAccount(String(username));

    const [currentPage, setCurrentPage] = useState(1);
    const achievementsPerPage = 6;

    const { achievementsPerAccount: obtainedAchievements,isLoadingAchievementsPerAccount,isErrorAchievementsPerAccount } = useAchievementsPerAccount(account?.id);

    if (isLoadingAchievements)
        return <Loader>Loading achievements...</Loader>;

    if (isErrorAchievements)
        return <Alert>Error loading achievements. Please try again later.</Alert>;

    if (isLoading)
        return <Loader>Loading account...</Loader>;

    if (isError)
        return <Alert>Error loading account. Please try again later.</Alert>;

    if (isLoadingAchievementsPerAccount)
        return <Loader>Loading achievements...</Loader>;

    if (isErrorAchievementsPerAccount)
        return <Alert>Error loading achievements. Please try again later.</Alert>;


    // Pagination logic
    const startIndex = (currentPage - 1) * achievementsPerPage;
    const endIndex = startIndex + achievementsPerPage;
    const paginatedAchievements = achievements?.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (!achievements || endIndex < achievements.length) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Achievements
            </Typography>

            <Accordion
                sx={{
                    backgroundColor: "rgba(26, 32, 44, 0.8)",
                    borderRadius: "10px",
                    color: "white",
                    marginBottom: "20px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                    sx={{
                        padding: "10px 20px",
                        fontFamily: "'Kalam', sans-serif",
                        fontWeight: "bold",
                    }}
                >
                    <Typography variant="h6">Stats</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        <ListItem>
                            <ListItemText primary={`Wins: ${account?.wins}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Played games: ${account?.playedGames}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Royal flushes: ${account?.royalFlushes}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Flushes: ${account?.flushes}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Straights: ${account?.straights}`} />
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                }}
            >
                {paginatedAchievements?.map((achievement) => (
                    <AchievementCard
                        key={achievement.name}
                        achievement={achievement}
                        isObtained={obtainedAchievements?.some(obtained => obtained.id === achievement.id)}
                    />
                ))}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button onClick={handleNextPage} disabled={!achievements || endIndex >= achievements.length}>
                    Next
                </Button>
            </Box>
        </Container>
    );
}

export default Achievement;
