import { Box } from "@mui/material";
import TotalRatingButton from "./TotalRatingButton";
import EmployeesCountButton from "./EmployeesCountButton";
import Top5Button from "./Top5Button";
import AddressGroupButton from "./AddressGroupButton";

const OrganizationToolBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mt: 2,
        mb: 2,
      }}
    >
      <TotalRatingButton />
      <EmployeesCountButton />
      <Top5Button />
      <AddressGroupButton />
    </Box>
  );
};

export default OrganizationToolBar;
