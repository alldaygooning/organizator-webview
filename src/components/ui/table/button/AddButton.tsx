import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import OrganizationModal from "../modal/OrganizationModal";

const AddButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setIsModalOpen(true)}
      >
        Add Organization
      </Button>

      <OrganizationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
      />
    </>
  );
};

export default AddButton;
