import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Paper,
    Divider,
    Alert,
} from "@mui/material";
import type { ParsedTask } from "./conflict";
import { conflictService } from "./conflictService";
import { OrganizationCard } from "./OrganizationCard";

const ConflictResolutionPage: React.FC = () => {
    const [tasks, setTasks] = useState<ParsedTask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ParsedTask | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setError(null);
            const tasksData = await conflictService.getConflictTasks();
            setTasks(tasksData);
        } catch (err) {
            setError("Failed to load conflict tasks");
            console.error(err);
        }
    };

    const resolveConflict = async (
        taskId: string,
        decision: "KEEP_EXISTING" | "REPLACE_WITH_NEW"
    ) => {
        setLoading(true);
        try {
            await conflictService.resolveConflict(taskId, decision);
            await fetchTasks();
            setSelectedTask(null);
        } catch (err) {
            setError("Failed to resolve conflict");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (selectedTask) {
        return (
            <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
                <Button onClick={() => setSelectedTask(null)} sx={{ mb: 3 }}>
                    ← Back to conflicts
                </Button>

                <Typography variant="h4" gutterBottom>
                    Review Conflict: {selectedTask.existingOrg.fullName}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                        mb: 3,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <OrganizationCard
                            organization={selectedTask.existingOrg}
                            title="Existing Organization"
                            color="error"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <OrganizationCard
                            organization={selectedTask.newOrg}
                            title="New Organization"
                            color="success"
                        />
                    </Box>
                </Box>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Resolution Actions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() =>
                                resolveConflict(
                                    selectedTask.id,
                                    "KEEP_EXISTING"
                                )
                            }
                            disabled={loading}
                            size="large"
                        >
                            Keep Existing
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() =>
                                resolveConflict(
                                    selectedTask.id,
                                    "REPLACE_WITH_NEW"
                                )
                            }
                            disabled={loading}
                            size="large"
                        >
                            Replace with New
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>
                Organization Conflict Resolution
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Pending Conflicts ({tasks.length})
                    </Typography>

                    {tasks.length === 0 ? (
                        <Typography
                            color="text.secondary"
                            textAlign="center"
                            py={3}
                        >
                            No pending conflicts
                        </Typography>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {tasks.map((task) => (
                                <Paper
                                    key={task.id}
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography variant="h6">
                                                {task.existingOrg.fullName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Created:{" "}
                                                {new Date(
                                                    task.createTime
                                                ).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                setSelectedTask(task)
                                            }
                                        >
                                            Review
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ConflictResolutionPage;
