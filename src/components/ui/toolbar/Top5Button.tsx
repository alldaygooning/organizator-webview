import { Button } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useState } from "react";
import { Organization } from "../../../entities/organization/Organization";
import { useNotification } from "../../hook/useNotification";
import Top5Modal from "./Top5Modal";

const Top5Button = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topOrganizations, setTopOrganizations] = useState<Organization[]>([]);
  const { error } = useNotification();

  const handleTop5 = async () => {
    try {
      const response = await fetch("/api/organizations/top-turnover", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const organizations: Organization[] = await response.json();
        setTopOrganizations(organizations);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch top organizations");
        error("Error", "Failed to fetch top organizations");
      }
    } catch (err) {
      console.error("Error fetching top organizations:", err);
      error("Error", "An error occurred while fetching top organizations");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LeaderboardIcon />}
        onClick={handleTop5}
        sx={{
          textTransform: "none",
          fontWeight: "normal",
        }}
      >
        Top 5
      </Button>

      <Top5Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizations={topOrganizations}
      />
    </>
  );
};

export default Top5Button;
