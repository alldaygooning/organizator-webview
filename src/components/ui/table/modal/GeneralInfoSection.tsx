import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { OrganizationType } from "../../../../entities/organization/Organization";
import {
  validateName,
  validateFullName,
  validateAnnualTurnover,
  validateEmployeesCount,
  validateRating,
} from "../../../../validation";

interface GeneralInformationSectionProps {
  // Values
  name: string;
  annualTurnover: string;
  employeesCount: string;
  rating: string;
  fullName: string;
  organizationType: OrganizationType | "";
  // Setters
  onNameChange: (value: string) => void;
  onAnnualTurnoverChange: (value: string) => void;
  onEmployeesCountChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onOrganizationTypeChange: (value: OrganizationType) => void;
}

const GeneralInformationSection: React.FC<GeneralInformationSectionProps> = ({
  // Values
  name,
  annualTurnover,
  employeesCount,
  rating,
  fullName,
  organizationType,
  // Setters
  onNameChange,
  onAnnualTurnoverChange,
  onEmployeesCountChange,
  onRatingChange,
  onFullNameChange,
  onOrganizationTypeChange,
}) => {
  const [errors, setErrors] = useState({
    name: "",
    annualTurnover: "",
    employeesCount: "",
    rating: "",
    fullName: "",
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

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onNameChange(value);
      clearError("name");
      debouncedValidation("name", value, validateName);
    },
    [onNameChange, debouncedValidation, clearError]
  );

  const handleNumericChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: (value: string) => void,
      field: keyof typeof errors,
      validator: (value: string) => string
    ) => {
      const value = e.target.value;

      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setter(value);
        clearError(field);
        debouncedValidation(field, value, validator);
      }
    },
    [debouncedValidation, clearError]
  );

  const handleAnnualTurnoverChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleNumericChange(
        e,
        onAnnualTurnoverChange,
        "annualTurnover",
        validateAnnualTurnover
      );
    },
    [handleNumericChange, onAnnualTurnoverChange]
  );

  const handleEmployeesCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleNumericChange(
        e,
        onEmployeesCountChange,
        "employeesCount",
        validateEmployeesCount
      );
    },
    [handleNumericChange, onEmployeesCountChange]
  );

  const handleRatingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleNumericChange(e, onRatingChange, "rating", validateRating);
    },
    [handleNumericChange, onRatingChange]
  );

  const handleFullNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFullNameChange(value);
      clearError("fullName");
      debouncedValidation("fullName", value, validateFullName);
    },
    [onFullNameChange, debouncedValidation, clearError]
  );

  const handleOrganizationTypeChange = useCallback(
    (e: any) => {
      onOrganizationTypeChange(e.target.value as OrganizationType);
    },
    [onOrganizationTypeChange]
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        General Information
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={handleNameChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Annual Turnover"
          fullWidth
          value={annualTurnover}
          onChange={handleAnnualTurnoverChange}
          error={!!errors.annualTurnover}
          helperText={errors.annualTurnover}
        />

        <TextField
          label="Employees Count"
          fullWidth
          value={employeesCount}
          onChange={handleEmployeesCountChange}
          error={!!errors.employeesCount}
          helperText={errors.employeesCount}
        />

        <TextField
          label="Rating"
          fullWidth
          value={rating}
          onChange={handleRatingChange}
          error={!!errors.rating}
          helperText={errors.rating}
        />

        <TextField
          label="Full Name"
          fullWidth
          value={fullName}
          onChange={handleFullNameChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <FormControl fullWidth>
          <InputLabel>Organization Type</InputLabel>
          <Select
            value={organizationType}
            label="Organization Type"
            onChange={handleOrganizationTypeChange}
          >
            <MenuItem value={OrganizationType.COMMERCIAL}>Commercial</MenuItem>
            <MenuItem value={OrganizationType.PUBLIC}>Public</MenuItem>
            <MenuItem value={OrganizationType.GOVERNMENT}>Government</MenuItem>
            <MenuItem value={OrganizationType.PRIVATE_LIMITED_COMPANY}>
              Private Limited Company
            </MenuItem>
            <MenuItem value={OrganizationType.OPEN_JOINT_STOCK_COMPANY}>
              Open Joint Stock Company
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default React.memo(GeneralInformationSection);
