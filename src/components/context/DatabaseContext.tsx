import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Organization } from "../../entities/organization/Organization";
import type { Coordinates } from "../../entities/organization/attribute/Coordinates";
import type { Address } from "../../entities/organization/attribute/Address";

interface DatabaseContextType {
  organizations: Map<number, Organization>;
  coordinates: Map<number, Coordinates>;
  addresses: Map<number, Address>;

  // Organization methods
  setOrganizations: (orgs: Map<number, Organization>) => void;
  addOrganization: (id: number, organization: Organization) => void;
  updateOrganization: (id: number, organization: Organization) => void;
  removeOrganization: (id: number) => void;

  // Coordinates methods
  setCoordinates: (coords: Map<number, Coordinates>) => void;
  addCoordinates: (id: number, coordinates: Coordinates) => void;
  removeCoordinates: (id: number) => void;

  // Address methods
  setAddresses: (addrs: Map<number, Address>) => void;
  addAddress: (id: number, address: Address) => void;
  removeAddress: (id: number) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

interface OrganizationDTO {
  organization: Organization;
  ownerId: number;
}

// API calls
const fetchOrganizations = async (): Promise<OrganizationDTO[]> => {
  const response = await fetch("/api/organizations");
  return response.json();
};

const fetchAddresses = async (): Promise<Address[]> => {
  const response = await fetch("/api/organizations/addresses");
  return response.json();
};

const fetchCoordinates = async (): Promise<Coordinates[]> => {
  const response = await fetch("/api/organizations/coordinates");
  return response.json();
};

const arrayToMap = <T extends { id: number }>(array: T[]): Map<number, T> => {
  return new Map(array.map((item) => [item.id, item]));
};

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [organizations, setOrganizations] = useState<Map<number, Organization>>(
    new Map()
  );
  const [coordinates, setCoordinates] = useState<Map<number, Coordinates>>(
    new Map()
  );
  const [addresses, setAddresses] = useState<Map<number, Address>>(new Map());

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgsData, addrsData, coordsData] = await Promise.all([
          fetchOrganizations(),
          fetchAddresses(),
          fetchCoordinates(),
        ]);

        const organizations: Organization[] = [];
        orgsData.forEach((value) => {
          value.organization.ownerId = value.ownerId;
          organizations.push(value.organization);
        });

        setOrganizations(arrayToMap(organizations));
        setAddresses(arrayToMap(addrsData));
        setCoordinates(arrayToMap(coordsData));
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  // Organization methods
  const addOrganization = (id: number, organization: Organization) => {
    setOrganizations((prev) => new Map(prev).set(id, organization));
  };

  const updateOrganization = (id: number, organization: Organization) => {
    setOrganizations((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.set(id, organization);
      }
      return newMap;
    });
  };

  const removeOrganization = (id: number) => {
    setOrganizations((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  // Coordinates methods
  const addCoordinates = (id: number, coordinates: Coordinates) => {
    setCoordinates((prev) => new Map(prev).set(id, coordinates));
  };

  const removeCoordinates = (id: number) => {
    setCoordinates((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  // Address methods
  const addAddress = (id: number, address: Address) => {
    setAddresses((prev) => new Map(prev).set(id, address));
  };

  const removeAddress = (id: number) => {
    setAddresses((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const value: DatabaseContextType = {
    organizations,
    coordinates,
    addresses,
    setOrganizations,
    addOrganization,
    updateOrganization,
    removeOrganization,
    setCoordinates,
    addCoordinates,
    removeCoordinates,
    setAddresses,
    addAddress,
    removeAddress,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider");
  }
  return context;
};
