import { useMaterialReactTable } from "material-react-table";
import { createColumns } from "./columns";
import { useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { useUser } from "../../context/UserContext";
import AddButton from "./button/AddButton";
import EditButton from "./EditButton"; // Import the new EditButton
import { Box, Container, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { notificationService } from "../../../notification/notification";
import DeleteByTypeButton from "./button/DeleteByTypeButton";

export const useOrgTable = () => {
  const db = useDatabase();
  const userContext = useUser();

  const data = useMemo(
    () => Array.from(db.organizations.values()),
    [db.organizations]
  );
  const columns = useMemo(() => createColumns(), []);

  return useMaterialReactTable({
    columns,
    data,
    enableEditing: true, // THIS FOR DELETION??? WHAAAT?
    enableRowActions: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: false,
    enableSorting: true,
    enableColumnActions: false,
    enableHiding: false,
    enableDensityToggle: false,

    renderTopToolbarCustomActions: () =>
      userContext.isLoggedIn ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <AddButton />
          <DeleteByTypeButton />
        </Container>
      ) : (
        ""
      ),

    renderRowActions: ({ row }) => {
      const organization = row.original;

      // Only show actions for organizations owned by the logged-in user
      if (
        userContext.isLoggedIn &&
        userContext.user?.id === organization.ownerId
      ) {
        return (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <EditButton organization={organization} />
            <IconButton
              color="error"
              onClick={() =>
                handleDeleteOrganization(organization.id, organization.name)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }

      return null;
    },
  });
};

const handleDeleteOrganization = async (id: number, name: string) => {
  try {
    const response = await fetch(`/api/organizations/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      notificationService.info(
        `${name} deleted`,
        "You will never see it again..."
      );
    } else {
      console.error("Failed to delete organization");
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
  }
};
