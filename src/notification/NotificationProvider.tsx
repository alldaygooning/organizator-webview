import React from "react";
import { SnackbarProvider, useSnackbar, type VariantType } from "notistack";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

export interface NotificationOptions {
  variant: "info" | "error" | "warn" | "success";
  title: string;
  message: string;
  autoHideDuration?: number;
  persist?: boolean;
}

interface NotificationContextType {
  notify: (options: NotificationOptions) => void;
  info: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  warn: (title: string, message: string) => void;
  success: (title: string, message: string) => void;
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined);

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

const useNotificationInternal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const notify = React.useCallback(
    (options: NotificationOptions) => {
      const {
        variant,
        title,
        message,
        autoHideDuration,
        persist = false,
      } = options;

      const notistackVariant: VariantType =
        variant === "warn" ? "warning" : variant;

      const content = (
        <div style={{ fontFamily: theme.typography.fontFamily }}>
          <Typography variant="body2">{message}</Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ marginBottom: "4px" }}
          >
            {title}
          </Typography>
        </div>
      );

      enqueueSnackbar(content, {
        variant: notistackVariant,
        autoHideDuration: persist ? null : autoHideDuration || 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
      });
    },
    [enqueueSnackbar, theme]
  );

  const info = React.useCallback(
    (message: string, title: string) => {
      notify({ variant: "info", message, title });
    },
    [notify]
  );

  const error = React.useCallback(
    (message: string, title: string) => {
      notify({ variant: "error", message, title });
    },
    [notify]
  );

  const warn = React.useCallback(
    (message: string, title: string) => {
      notify({ variant: "warn", message, title });
    },
    [notify]
  );

  const success = React.useCallback(
    (message: string, title: string) => {
      notify({ variant: "success", message, title });
    },
    [notify]
  );

  return {
    notify,
    info,
    error,
    warn,
    success,
  };
};

const NotificationProviderInternal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notification = useNotificationInternal();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NotificationProviderInternal>{children}</NotificationProviderInternal>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
