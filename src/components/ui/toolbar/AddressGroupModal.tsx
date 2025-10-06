import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Address } from "../../../entities/organization/attribute/Address";

interface AddressCountProjection {
  addressId: number;
  organizationCount: number;
}

interface AddressGroupModalProps {
  open: boolean;
  onClose: () => void;
  addressCounts: AddressCountProjection[];
  addresses: Map<number, Address>;
}

const AddressGroupModal: React.FC<AddressGroupModalProps> = ({
  open,
  onClose,
  addressCounts,
  addresses,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon color="primary" />
          <Typography variant="h6">Organizations grouped by address</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {addressCounts.map((projection) => {
            const address = addresses.get(projection.addressId);
            const addressString = address
              ? `${address.street}:${address.zip}`
              : "Unknown Address";

            return (
              <Box key={projection.addressId}>
                <ListItem alignItems="flex-start">
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography fontWeight="bold">
                            {addressString}
                          </Typography>
                          <Typography color="text.secondary">
                            ID: {projection.addressId}
                          </Typography>
                          <Typography fontWeight="bold">
                            : {projection.organizationCount}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </ListItem>
              </Box>
            );
          })}
        </List>
        {addressCounts.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={2}>
            No address data found
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressGroupModal;
