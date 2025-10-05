import { useMaterialReactTable } from "material-react-table";
import { createColumns } from "./columns";
import { useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { useUser } from "../../context/UserContext";
import AddButton from "./AddButton";

export const useOrgTable = () => {
  const db = useDatabase();
  const userContext = useUser();

  const data = useMemo(
    () => Array.from(db.organizations.values()),
    [db.organizations]
  );
  const columns = useMemo(() => createColumns(), []);

  return useMaterialReactTable({
    columns,
    data,
    enableEditing: false,
    enableRowActions: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: false,
    enableSorting: true,
    enableColumnActions: false,
    enableHiding: false,
    enableDensityToggle: false,

    renderTopToolbarCustomActions: () =>
      userContext.isLoggedIn ? <AddButton /> : "",
  });
};
