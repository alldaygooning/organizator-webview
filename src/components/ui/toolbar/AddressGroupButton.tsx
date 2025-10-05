import { Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { useNotification } from "../../hook/useNotification";
import AddressGroupModal from "./AddressGroupModal";

interface AddressCountProjection {
  addressId: number;
  organizationCount: number;
}

const AddressGroupButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressCounts, setAddressCounts] = useState<AddressCountProjection[]>(
    []
  );
  const { error } = useNotification();
  const db = useDatabase();

  const handleAddressGroup = async () => {
    try {
      const response = await fetch("/api/organizations/group-by-address", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const projections: AddressCountProjection[] = await response.json();
        setAddressCounts(projections);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch address groups");
        error("Error", "Failed to fetch address groups");
      }
    } catch (err) {
      console.error("Error fetching address groups:", err);
      error("Error", "An error occurred while fetching address groups");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LocationOnIcon />}
        onClick={handleAddressGroup}
        sx={{
          textTransform: "none",
          fontWeight: "normal",
        }}
      >
        Address Group
      </Button>

      <AddressGroupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addressCounts={addressCounts}
        addresses={db.addresses}
      />
    </>
  );
};

export default AddressGroupButton;
