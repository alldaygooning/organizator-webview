import { useEffect, useRef } from "react";
import { useDatabase } from "../context/DatabaseContext";
import type { Organization } from "../../entities/organization/Organization";
import type { Address } from "../../entities/organization/attribute/Address";
import type { Coordinates } from "../../entities/organization/attribute/Coordinates";

export const SSEEventListener: React.FC = () => {
  const {
    addOrganization,
    removeOrganization,
    addCoordinates,
    addAddress,
    updateOrganization,
  } = useDatabase();

  const actionsRef = useRef({
    updateOrganization,
    addOrganization,
    removeOrganization,
    addCoordinates,
    addAddress,
  });

  useEffect(() => {
    actionsRef.current = {
      updateOrganization,
      addOrganization,
      removeOrganization,
      addCoordinates,
      addAddress,
    };
  }, [
    addOrganization,
    removeOrganization,
    addCoordinates,
    addAddress,
    updateOrganization,
  ]);

  useEffect(() => {
    console.log("SSE: Creating EventSource connection");

    const eventSource = new EventSource("/api/organizations/sse", {
      withCredentials: false,
    });

    const handleOrganizationCreated = (event: MessageEvent) => {
      const data: { organization: Organization; ownerId: number } = JSON.parse(
        event.data
      );
      data.organization.ownerId = data.ownerId;
      actionsRef.current.addOrganization(
        data.organization.id,
        data.organization
      );
    };

    const handleOrganizationUpdated = (event: MessageEvent) => {
      const data: { organization: Organization; ownerId: number } = JSON.parse(
        event.data
      );
      data.organization.ownerId = data.ownerId;
      actionsRef.current.updateOrganization(
        data.organization.id,
        data.organization
      );
    };

    const handleOrganizationDeleted = (event: MessageEvent) => {
      const id: number = JSON.parse(event.data);
      actionsRef.current.removeOrganization(id);
    };

    const handleCoordinatesCreated = (event: MessageEvent) => {
      const coordinates: Coordinates = JSON.parse(event.data);
      actionsRef.current.addCoordinates(coordinates.id, coordinates);
    };

    const handleAddressCreated = (event: MessageEvent) => {
      const address: Address = JSON.parse(event.data);
      actionsRef.current.addAddress(address.id, address);
    };

    // Add event listeners
    eventSource.addEventListener(
      "ORGANIZATION_CREATED",
      handleOrganizationCreated
    );
    eventSource.addEventListener(
      "ORGANIZATION_UPDATED",
      handleOrganizationUpdated
    );
    eventSource.addEventListener(
      "ORGANIZATION_DELETED",
      handleOrganizationDeleted
    );
    eventSource.addEventListener(
      "COORDINATES_CREATED",
      handleCoordinatesCreated
    );
    eventSource.addEventListener("ADDRESS_CREATED", handleAddressCreated);

    // Handle errors and connection state
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
    };

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    return () => {
      console.log("SSE: Cleaning up EventSource connection");
      eventSource.removeEventListener(
        "ORGANIZATION_CREATED",
        handleOrganizationCreated
      );
      eventSource.removeEventListener(
        "ORGANIZATION_UPDATED",
        handleOrganizationUpdated
      );
      eventSource.removeEventListener(
        "ORGANIZATION_DELETED",
        handleOrganizationDeleted
      );
      eventSource.removeEventListener(
        "COORDINATES_CREATED",
        handleCoordinatesCreated
      );
      eventSource.removeEventListener("ADDRESS_CREATED", handleAddressCreated);
      eventSource.close();
    };
  }, []); // Empty dependency array - runs only once

  return null;
};
