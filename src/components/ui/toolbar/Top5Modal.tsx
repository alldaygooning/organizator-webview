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
import { Organization } from "../../../entities/organization/Organization";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

interface Top5ModalProps {
  open: boolean;
  onClose: () => void;
  organizations: Organization[];
}

const Top5Modal: React.FC<Top5ModalProps> = ({
  open,
  onClose,
  organizations,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <LeaderboardIcon color="primary" />
          <Typography variant="h6">
            Top 5 organizations by annual turnover
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {organizations.map((org, index) => (
            <Box key={org.id}>
              <ListItem alignItems="flex-start">
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", gap: 1, flexDirection: "row" }}
                      >
                        <Typography color="text.secondary">
                          {index + 1}.
                        </Typography>
                        <Typography fontWeight="bold">
                          {org.fullName}
                        </Typography>
                        <Typography color="text.secondary">
                          ID: {org.id}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" flexDirection="column" mt={0.5}>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="bold"
                        >
                          Annual Turnover: $
                          {org.annualTurnover?.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </ListItem>
            </Box>
          ))}
        </List>
        {organizations.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={2}>
            No organizations found
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Top5Modal;
