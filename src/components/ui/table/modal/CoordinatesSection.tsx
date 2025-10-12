import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import {
  validateCoordinatesX,
  validateCoordinatesY,
} from "../../../../validation";
import { useDatabase } from "../../../context/DatabaseContext";

interface CoordinatesSectionProps {
  // FIELDS
  coordinatesInputMode: "manual" | "existing";
  x: string;
  y: string;
  selectedCoordinateId: number | "";
  // SETTERS
  onCoordinatesInputModeChange: (mode: "manual" | "existing") => void;
  onXChange: (value: string) => void;
  onYChange: (value: string) => void;
  onSelectedCoordinateIdChange: (id: number | "") => void;
}

const CoordinatesSection: React.FC<CoordinatesSectionProps> = ({
  // FIELDS
  coordinatesInputMode,
  x,
  y,
  selectedCoordinateId,
  // SETTERS
  onCoordinatesInputModeChange,
  onXChange,
  onYChange,
  onSelectedCoordinateIdChange,
}) => {
  const { coordinates } = useDatabase();
  const [errors, setErrors] = useState({
    x: "",
    y: "",
  });

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

  const clearError = useCallback((field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleXChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^-?\d*$/.test(value)) {
        onXChange(value);
        clearError("x");
        debouncedValidation("x", value, validateCoordinatesX);
      }
    },
    [onXChange, debouncedValidation, clearError]
  );

  const handleYChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^-?\d*$/.test(value)) {
        onYChange(value);
        clearError("y");
        debouncedValidation("y", value, validateCoordinatesY);
      }
    },
    [onYChange, debouncedValidation, clearError]
  );

  const handleInputModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mode = e.target.value as "manual" | "existing";
      onCoordinatesInputModeChange(mode);

      if (mode === "manual") {
        onSelectedCoordinateIdChange("");
      } else {
        onXChange("");
        onYChange("");
        setErrors({ x: "", y: "" });
      }
    },
    [
      onCoordinatesInputModeChange,
      onSelectedCoordinateIdChange,
      onXChange,
      onYChange,
    ]
  );

  const handleCoordinateSelect = useCallback(
    (coordinateId: number) => {
      onSelectedCoordinateIdChange(coordinateId);
      const selectedCoord = coordinates.get(coordinateId);
      if (selectedCoord) {
        onXChange(selectedCoord.x.toString());
        onYChange(selectedCoord.y.toString());
        setErrors({ x: "", y: "" });
      }
    },
    [onSelectedCoordinateIdChange, onXChange, onYChange, coordinates]
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Coordinates
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          value={coordinatesInputMode}
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

      {coordinatesInputMode === "manual" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="X Coordinate"
            fullWidth
            value={x}
            onChange={handleXChange}
            error={!!errors.x}
            helperText={errors.x}
          />
          <TextField
            label="Y Coordinate"
            fullWidth
            value={y}
            onChange={handleYChange}
            error={!!errors.y}
            helperText={errors.y}
          />
        </Box>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Select Coordinates</InputLabel>
          <Select
            value={selectedCoordinateId}
            label="Select Coordinates"
            onChange={(e) => handleCoordinateSelect(e.target.value as number)}
          >
            <MenuItem value="">None selected</MenuItem>
            {Array.from(coordinates.entries()).map(([id, coord]) => (
              <MenuItem key={id} value={id}>
                X: {coord.x}, Y: {coord.y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default React.memo(CoordinatesSection);
