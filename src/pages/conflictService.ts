import type { ParsedTask, Task } from "./conflict";
import { parseOrganizationFromJson } from "./organizationParser";

const API_BASE = 'http://localhost:8081/api/admin';

export const conflictService = {
    async getConflictTasks(): Promise<ParsedTask[]> {
        const response = await fetch(`${API_BASE}/conflict-tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const tasks: Task[] = await response.json();

        return tasks.map(task => ({
            id: task.id,
            name: task.name,
            createTime: task.createTime,
            existingOrg: parseOrganizationFromJson(task.variables.existingOrgData),
            newOrg: parseOrganizationFromJson(task.variables.newOrgData)
        }));
    },

    async resolveConflict(taskId: string, decision: 'KEEP_EXISTING' | 'REPLACE_WITH_NEW'): Promise<void> {
        const response = await fetch(`${API_BASE}/conflict-tasks/${taskId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ decision })
        });
        if (!response.ok) throw new Error('Failed to resolve conflict');
    }
};