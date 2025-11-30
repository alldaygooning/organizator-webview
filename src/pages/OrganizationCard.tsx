import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import type { Organization } from "../entities/organization/Organization";

interface OrganizationCardProps {
    organization: Organization;
    title: string;
    color: "success" | "error";
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
    organization,
    title,
    color,
}) => {
    return (
        <Card variant="outlined" sx={{ borderColor: `${color}.main` }}>
            <CardContent>
                <Typography variant="h6" color={`${color}.main`} gutterBottom>
                    {title}
                </Typography>

                <Box mb={2}>
                    <Typography variant="h5">
                        {organization.fullName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Name: {organization.name}
                    </Typography>
                </Box>

                <Chip
                    label={organization.type}
                    color={color}
                    size="small"
                    sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Annual Turnover"
                            secondary={`$${organization.annualTurnover.toLocaleString()}`}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Employees"
                            secondary={organization.employeesCount.toLocaleString()}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Rating"
                            secondary={organization.rating}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Coordinates"
                            secondary={`(${organization.coordinates.x}, ${organization.coordinates.y})`}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Address"
                            secondary={`${organization.address.street}, ${organization.address.zip}`}
                        />
                    </ListItem>

                    {organization.postalAddress && (
                        <ListItem>
                            <ListItemText
                                primary="Postal Address"
                                secondary={`${organization.postalAddress.street}, ${organization.postalAddress.zip}`}
                            />
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
};
