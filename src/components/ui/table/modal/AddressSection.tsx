import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { validateStreet, validateZip } from "../../../../validation";
import { useDatabase } from "../../../context/DatabaseContext";

interface AddressSectionProps {
  // FIELDS
  sectionTitle: string;
  addressInputMode: "manual" | "existing";
  street: string;
  zipCode: string;
  selectedAddressId: number | "";
  // SETTERS
  onAddressInputModeChange: (mode: "manual" | "existing") => void;
  onStreetChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onSelectedAddressIdChange: (id: number | "") => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  // FIELDS
  sectionTitle,
  addressInputMode,
  street,
  zipCode,
  selectedAddressId,
  // SETTERS
  onAddressInputModeChange,
  onStreetChange,
  onZipCodeChange,
  onSelectedAddressIdChange,
}) => {
  const { addresses } = useDatabase();
  const [errors, setErrors] = useState({
    street: "",
    zipCode: "",
  });

  // Debounced validation function
  const debouncedValidation = useMemo(
    () =>
      debounce(
        (
          field: keyof typeof errors,
          value: string,
          validator: (value: string) => string
        ) => {
          setErrors((prev) => ({ ...prev, [field]: validator(value) }));
        },
        300
      ),
    []
  );

  // Immediate error clearing
  const clearError = useCallback((field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleStreetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onStreetChange(value);
      clearError("street");
      debouncedValidation("street", value, validateStreet);
    },
    [onStreetChange, debouncedValidation, clearError]
  );

  const handleZipCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onZipCodeChange(value);
      clearError("zipCode");
      debouncedValidation("zipCode", value, validateZip);
    },
    [onZipCodeChange, debouncedValidation, clearError]
  );

  const handleInputModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mode = e.target.value as "manual" | "existing";
      onAddressInputModeChange(mode);

      if (mode === "manual") {
        onSelectedAddressIdChange("");
      } else {
        onStreetChange("");
        onZipCodeChange("");
        setErrors({ street: "", zipCode: "" });
      }
    },
    [
      onAddressInputModeChange,
      onSelectedAddressIdChange,
      onStreetChange,
      onZipCodeChange,
    ]
  );

  const handleAddressSelect = useCallback(
    (addressId: number) => {
      onSelectedAddressIdChange(addressId);
      const selectedAddress = addresses.get(addressId);
      if (selectedAddress) {
        onStreetChange(selectedAddress.street);
        onZipCodeChange(selectedAddress.zip);
        setErrors({ street: "", zipCode: "" });
      }
    },
    [onSelectedAddressIdChange, onStreetChange, onZipCodeChange, addresses]
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {sectionTitle}
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          value={addressInputMode}
          onChange={handleInputModeChange}
        >
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label="Enter Manually"
          />
          <FormControlLabel
            value="existing"
            control={<Radio />}
            label="Select Existing"
          />
        </RadioGroup>
      </FormControl>

      {addressInputMode === "manual" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Street"
            fullWidth
            value={street}
            onChange={handleStreetChange}
            error={!!errors.street}
            helperText={errors.street}
          />
          <TextField
            label="ZIP Code"
            fullWidth
            value={zipCode}
            onChange={handleZipCodeChange}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Box>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Select Address</InputLabel>
          <Select
            value={selectedAddressId}
            label="Select Address"
            onChange={(e) => handleAddressSelect(e.target.value as number)}
          >
            <MenuItem value="">None selected</MenuItem>
            {Array.from(addresses.entries()).map(([id, address]) => (
              <MenuItem key={id} value={id}>
                {address.street}, {address.zip}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default React.memo(AddressSection);
