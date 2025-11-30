import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    CircularProgress,
} from "@mui/material";
import { ImportStatus } from "../../entities/import/ImportEntry";
import { useImport } from "../../entities/import/ImportContext";

const StatusChip: React.FC<{ status: ImportStatus }> = ({ status }) => {
    const getColor = () => {
        switch (status) {
            case ImportStatus.SUCCESSFUL:
                return "success";
            case ImportStatus.FAILED:
                return "error";
            case ImportStatus.IN_PROGRESS:
                return "warning";
            default:
                return "default";
        }
    };

    return <Chip label={status} color={getColor()} size="small" />;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

export const ImportTable: React.FC = () => {
    const { imports, loading } = useImport();

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (imports.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="body1" color="textSecondary">
                    No import history found.
                </Typography>
            </Box>
        );
    }

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Import History
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="import history table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Total Organizations</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {imports.map((importEntry) => (
                            <TableRow
                                key={importEntry.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {importEntry.id}
                                </TableCell>
                                <TableCell>
                                    {formatDate(importEntry.createdAt)}
                                </TableCell>
                                <TableCell>{importEntry.userId}</TableCell>
                                <TableCell>{importEntry.total}</TableCell>
                                <TableCell>
                                    <StatusChip status={importEntry.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ImportTable;
