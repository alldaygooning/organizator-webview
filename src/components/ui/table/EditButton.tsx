import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import OrganizationModal from "./modal/OrganizationModal";
import type { Organization } from "../../../entities/organization/Organization";

interface EditButtonProps {
  organization: Organization;
}

const EditButton: React.FC<EditButtonProps> = ({ organization }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IconButton color="primary" onClick={() => setIsModalOpen(true)}>
        <Edit />
      </IconButton>

      <OrganizationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="edit"
        organization={organization}
      />
    </>
  );
};

export default EditButton;
