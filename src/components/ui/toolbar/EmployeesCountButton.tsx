import { Button } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useNotification } from "../../hook/useNotification";

const EmployeesCountButton = () => {
  const { info, error } = useNotification();

  const handleEmployeesCount = async () => {
    try {
      const response = await fetch("/api/organizations/employee-count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const employeesCount: number = await response.json();
        info(
          "Average employees count",
          `The average number of employees of top-10 highest annual turnover organizations: ${employeesCount}`
        );
      } else {
        console.error("Failed to fetch employees count");
        error("Error", "Failed to fetch employees count");
      }
    } catch (err) {
      console.error("Error fetching employees count:", err);
      error("Error", "An error occurred while fetching employees count");
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<PeopleIcon />}
      onClick={handleEmployeesCount}
      sx={{
        textTransform: "none",
        fontWeight: "normal",
      }}
    >
      Employees Count
    </Button>
  );
};

export default EmployeesCountButton;
