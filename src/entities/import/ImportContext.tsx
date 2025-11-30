import React, { createContext, useContext, useState, useEffect } from "react";
import { ImportEntry } from "../../entities/import/ImportEntry";
import { useUser } from "../../components/context/UserContext";

interface ImportContextType {
    imports: ImportEntry[];
    addImport: (importEntry: ImportEntry) => void;
    updateImport: (id: number, updates: Partial<ImportEntry>) => void;
    refreshImports: () => Promise<void>;
    loading: boolean;
}

const ImportContext = createContext<ImportContextType | undefined>(undefined);

export const ImportProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [imports, setImports] = useState<ImportEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useUser();

    const fetchImports = async () => {
        if (!isLoggedIn) {
            setImports([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/organizations/import/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                const importEntries = data.map(
                    (item: any) =>
                        new ImportEntry(
                            item.id,
                            item.createdAt,
                            item.userId,
                            item.total,
                            item.status
                        )
                );
                setImports(importEntries);
            } else {
                console.error("Failed to fetch imports");
            }
        } catch (error) {
            console.error("Error fetching imports:", error);
        } finally {
            setLoading(false);
        }
    };

    const addImport = (importEntry: ImportEntry) => {
        setImports((prev) => [importEntry, ...prev]);
    };

    const updateImport = (id: number, updates: Partial<ImportEntry>) => {
        setImports((prev) =>
            prev.map((imp) =>
                imp.id === id
                    ? Object.assign(
                          new ImportEntry(
                              imp.id,
                              imp.createdAt,
                              imp.userId,
                              imp.total,
                              imp.status
                          ),
                          imp,
                          updates
                      )
                    : imp
            )
        );
    };

    const refreshImports = async () => {
        await fetchImports();
    };

    useEffect(() => {
        fetchImports();
    }, [isLoggedIn]);

    const value: ImportContextType = {
        imports,
        addImport,
        updateImport,
        refreshImports,
        loading,
    };

    return (
        <ImportContext.Provider value={value}>
            {children}
        </ImportContext.Provider>
    );
};

export const useImport = () => {
    const context = useContext(ImportContext);
    if (context === undefined) {
        throw new Error("useImport must be used within an ImportProvider");
    }
    return context;
};
