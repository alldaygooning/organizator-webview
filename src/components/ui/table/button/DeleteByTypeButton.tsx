import React, { useState } from "react";
import { Menu, MenuItem, Button, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OrganizationType } from "../../../../entities/organization/Organization";
import { useNotification } from "../../../hook/useNotification";

export const DeleteByTypeButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { info, error } = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteByType = async (type: OrganizationType) => {
    try {
      const response = await fetch("/api/organizations/delete/type", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(type),
      });

      if (response.ok) {
        const deletedIds: number[] = await response.json();
        info(
          `${deletedIds.length} organizations were deleted`,
          "You will never see them again..."
        );
      } else {
        console.error("Failed to delete organizations by type");
        error("Deletion failed", "Failed to delete organizations by type");
      }
    } catch (err) {
      console.error("Error deleting organizations by type:", err);
      error("Error", "An error occurred while deleting organizations");
    } finally {
      handleClose();
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
        sx={{
          textTransform: "none",
          fontWeight: "normal",
          height: "40px",
        }}
      >
        Delete by Type
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "delete-by-type-button",
          },
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            Delete by type:
          </Typography>
        </MenuItem>

        {Object.values(OrganizationType).map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleDeleteByType(type)}
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.light",
                color: "white",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 18, mr: 1 }} />
            {type.replaceAll("_", " ")}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DeleteByTypeButton;
