import { Button } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNotification } from "../../hook/useNotification";

const TotalRatingButton = () => {
  const { info, error } = useNotification();

  const handleTotalRating = async () => {
    try {
      const response = await fetch("/api/organizations/total-rating", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const totalRating: number = await response.json();
        info(
          "Total Rating",
          `The total rating of all organizations is: ${totalRating}`
        );
      } else {
        console.error("Failed to fetch total rating");
        error("Error", "Failed to fetch total rating");
      }
    } catch (err) {
      console.error("Error fetching total rating:", err);
      error("Error", "An error occurred while fetching total rating");
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<TrendingUpIcon />}
      onClick={handleTotalRating}
      sx={{
        textTransform: "none",
        fontWeight: "normal",
      }}
    >
      Total Rating
    </Button>
  );
};

export default TotalRatingButton;
