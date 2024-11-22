import {Card, CardMedia} from "@mui/material";
import {PlayingCard} from "../model/PlayingCard.ts";

type PlayingCardProps = {
  card: PlayingCard;
  height: number;
};

function PlayingCardDisplay({card, height}: PlayingCardProps) {
    return(
        <Card key={card.id} sx={{ width: height*2/3 }}>
            <CardMedia
                component="img"
                height={`${height}`}
                image={`/images/${SuitLabels[card.suit]}_${card.rank}.png`}
                alt={`${card.rank} of ${SuitLabels[card.suit]}`}
            />
        </Card>
    )
}

const SuitLabels: Record<string, string> = {
    "SPADES": "spades",
    "CLUBS": "clubs",
    "HEARTS": "hearts",
    "DIAMONDS": "diamonds"
};

export default PlayingCardDisplay;