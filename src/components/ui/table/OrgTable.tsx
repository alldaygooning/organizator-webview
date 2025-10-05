import React from "react";
import { MaterialReactTable } from "material-react-table";
import { useOrgTable } from "./useOrgTable.tsx";
import { Box } from "@mui/material";

export const OrgTable: React.FC = () => {
  const table = useOrgTable();

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};
