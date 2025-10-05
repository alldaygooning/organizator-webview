import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import AddressSection from "./AddressSection";
import CoordinatesSection from "./CoordinatesSection";
import GeneralInformationSection from "./GeneralInfoSection";
import type {
  Organization,
  OrganizationType,
} from "../../../../entities/organization/Organization";
import { useNotification } from "../../../../notification/NotificationProvider";
import {
  createOrganization,
  createOrganizationData,
} from "../../../../entities/organization/organizationApi";
import {
  validateName,
  validateFullName,
  validateAnnualTurnover,
  validateEmployeesCount,
  validateRating,
  validateCoordinatesX,
  validateCoordinatesY,
  validateStreet,
  validateZip,
} from "../../../../validation";

interface OrganizationModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  organization?: Organization;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  open,
  onClose,
  mode,
  organization,
}) => {
  // General Information State
  const [name, setName] = useState("");
  const [annualTurnover, setAnnualTurnover] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [rating, setRating] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationType, setOrganizationType] = useState<
    OrganizationType | ""
  >("");

  // Coordinates State
  const [coordinatesInputMode, setCoordinatesInputMode] = useState<
    "manual" | "existing"
  >("manual");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [selectedCoordinateId, setSelectedCoordinateId] = useState<number | "">(
    ""
  );

  // Address State
  const [addressInputMode, setAddressInputMode] = useState<
    "manual" | "existing"
  >("manual");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | "">("");

  // Postal Address State
  const [postalAddressInputMode, setPostalAddressInputMode] = useState<
    "manual" | "existing"
  >("manual");
  const [postalStreet, setPostalStreet] = useState("");
  const [postalZipCode, setPostalZipCode] = useState("");
  const [selectedPostalAddressId, setSelectedPostalAddressId] = useState<
    number | ""
  >("");

  useEffect(() => {
    if (mode === "edit" && organization) {
      // POPULATE FORM
      setName(organization.name || "");
      setAnnualTurnover(organization.annualTurnover?.toString() || "");
      setEmployeesCount(organization.employeesCount?.toString() || "");
      setRating(organization.rating?.toString() || "");
      setFullName(organization.fullName || "");
      setOrganizationType(organization.type || "");

      setCoordinatesInputMode("existing");
      setSelectedCoordinateId(organization.coordinates.id);
      setX(`${organization.coordinates.x}`);
      setY(`${organization.coordinates.y}`);

      setAddressInputMode("existing");
      setSelectedAddressId(organization.address.id);
      setStreet(organization.address.street);
      setZipCode(organization.address.zip);

      setPostalAddressInputMode("existing");
      setSelectedPostalAddressId(organization.postalAddress.id);
      setPostalStreet(organization.postalAddress.street);
      setPostalZipCode(organization.postalAddress.zip);
    }
  }, [mode, organization, open]);

  const { success, error, info } = useNotification();

  // SUBMIT BUTTON VALIDATION
  const isFormValid = () => {
    // General Information validation
    const isGeneralInfoValid =
      validateName(name) === "" &&
      validateFullName(fullName) === "" &&
      validateAnnualTurnover(annualTurnover) === "" &&
      validateEmployeesCount(employeesCount) === "" &&
      validateRating(rating) === "" &&
      organizationType !== "";

    // Coordinates validation
    let isCoordinatesValid = false;
    if (coordinatesInputMode === "manual") {
      isCoordinatesValid =
        validateCoordinatesX(x) === "" && validateCoordinatesY(y) === "";
    } else {
      isCoordinatesValid = selectedCoordinateId !== "";
    }

    // Address validation
    let isAddressValid = false;
    if (addressInputMode === "manual") {
      isAddressValid =
        validateStreet(street) === "" && validateZip(zipCode) === "";
    } else {
      isAddressValid = selectedAddressId !== "";
    }

    // Postal Address validation
    let isPostalAddressValid = false;
    if (postalAddressInputMode === "manual") {
      isPostalAddressValid =
        validateStreet(postalStreet) === "" &&
        validateZip(postalZipCode) === "";
    } else {
      isPostalAddressValid = selectedPostalAddressId !== "";
    }

    return (
      isGeneralInfoValid &&
      isCoordinatesValid &&
      isAddressValid &&
      isPostalAddressValid
    );
  };

  const handleConfirmOrganization = async () => {
    if (mode === "create") {
      try {
        const result = await createOrganizationData({
          coordinatesInputMode,
          x,
          y,
          selectedCoordinateId,
          addressInputMode,
          street,
          zipCode,
          selectedAddressId,
          postalAddressInputMode,
          postalStreet,
          postalZipCode,
          selectedPostalAddressId,
        });

        if (result.success) {
          console.log("Created IDs:", result.ids);

          const organizationResult = await createOrganization({
            name: name.trim(),
            fullName: fullName.trim(),
            coordinatesId: result.ids.coordinatesId!,
            addressId: result.ids.addressId!,
            postalAddressId: result.ids.postalAddressId!,
            annualTurnover: parseInt(annualTurnover),
            employeesCount: parseInt(employeesCount),
            rating: parseInt(rating),
            type: organizationType as OrganizationType,
          });

          if (organizationResult.status === 201) {
            success(
              `Organization ${fullName} created`,
              "You can now manage it"
            );
            onClose();
          } else if (organizationResult.status === 401) {
            error(
              "Unauthorized",
              "You are not authorized to create organizations"
            );
          } else {
            error("Creation failed", "Failed to create organization");
          }
        }
      } catch (err) {
        error("Creation failed", "Failed to create organization resources");
      }
    } else if (mode === "edit" && organization) {
      try {
        const result = await createOrganizationData({
          coordinatesInputMode,
          x,
          y,
          selectedCoordinateId,
          addressInputMode,
          street,
          zipCode,
          selectedAddressId,
          postalAddressInputMode,
          postalStreet,
          postalZipCode,
          selectedPostalAddressId,
        });

        if (result.success) {
          console.log("Created/Updated IDs:", result.ids);

          const updatePayload: any = {};

          if (name.trim() !== organization.name)
            updatePayload.name = name.trim();
          if (fullName.trim() !== organization.fullName)
            updatePayload.fullName = fullName.trim();
          if (parseInt(annualTurnover) !== organization.annualTurnover)
            updatePayload.annualTurnover = parseInt(annualTurnover);
          if (parseInt(employeesCount) !== organization.employeesCount)
            updatePayload.employeesCount = parseInt(employeesCount);
          if (parseInt(rating) !== organization.rating)
            updatePayload.rating = parseInt(rating);
          if (organizationType !== organization.type)
            updatePayload.type = organizationType;

          if (
            result.ids.coordinatesId &&
            result.ids.coordinatesId !== organization.coordinates.id
          ) {
            updatePayload.coordinatesId = result.ids.coordinatesId;
          }
          if (
            result.ids.addressId &&
            result.ids.addressId !== organization.address.id
          ) {
            updatePayload.addressId = result.ids.addressId;
          }
          if (
            result.ids.postalAddressId &&
            result.ids.postalAddressId !== organization.postalAddress.id
          ) {
            updatePayload.postalAddressId = result.ids.postalAddressId;
          }

          if (Object.keys(updatePayload).length > 0) {
            const response = await fetch(
              `/api/organizations/update/${organization.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatePayload),
              }
            );

            if (response.ok) {
              success(
                `Organization ${name} updated`,
                "Changes saved successfully"
              );
              onClose();
            } else {
              error("Update failed", "Failed to update organization");
            }
          } else {
            info(
              "No changes detected",
              "Organization information is up to date"
            );
            onClose();
          }
        }
      } catch (err) {
        error("Update failed", "Failed to update organization resources");
      }
    }
  };

  // const isCreateDisabled = mode === "create" && !isFormValid();
  const isSubmitDisabled = !isFormValid() || (mode === "edit" && !organization);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {mode === "create" ? "Create Organization" : "Edit Organization"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <GeneralInformationSection
            // FIELDS
            name={name}
            annualTurnover={annualTurnover}
            employeesCount={employeesCount}
            rating={rating}
            fullName={fullName}
            organizationType={organizationType}
            // SETTERS
            onNameChange={setName}
            onAnnualTurnoverChange={setAnnualTurnover}
            onEmployeesCountChange={setEmployeesCount}
            onRatingChange={setRating}
            onFullNameChange={setFullName}
            onOrganizationTypeChange={setOrganizationType}
          />
          <CoordinatesSection
            // FIELDS
            coordinatesInputMode={coordinatesInputMode}
            x={x}
            y={y}
            selectedCoordinateId={selectedCoordinateId}
            // SETTERS
            onCoordinatesInputModeChange={setCoordinatesInputMode}
            onXChange={setX}
            onYChange={setY}
            onSelectedCoordinateIdChange={setSelectedCoordinateId}
          />
          <AddressSection
            sectionTitle="Address"
            // FIELDS
            addressInputMode={addressInputMode}
            street={street}
            zipCode={zipCode}
            selectedAddressId={selectedAddressId}
            // SETTERS
            onAddressInputModeChange={setAddressInputMode}
            onStreetChange={setStreet}
            onZipCodeChange={setZipCode}
            onSelectedAddressIdChange={setSelectedAddressId}
          />
          <AddressSection
            sectionTitle="Postal Address"
            // FIELDS
            addressInputMode={postalAddressInputMode}
            street={postalStreet}
            zipCode={postalZipCode}
            selectedAddressId={selectedPostalAddressId}
            // SETTERS
            onAddressInputModeChange={setPostalAddressInputMode}
            onStreetChange={setPostalStreet}
            onZipCodeChange={setPostalZipCode}
            onSelectedAddressIdChange={setSelectedPostalAddressId}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ fontWeight: "bold" }}
          startIcon={mode === "create" ? <AddIcon /> : <SaveIcon />}
          onClick={handleConfirmOrganization}
          disabled={isSubmitDisabled}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationModal;
