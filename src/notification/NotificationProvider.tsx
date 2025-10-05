import React from "react";
import { SnackbarProvider, useSnackbar, type VariantType } from "notistack";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { notificationService } from "./notification";

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
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ marginBottom: "4px" }}
          >
            {title}
          </Typography>
          <Typography variant="body2">{message}</Typography>
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
    (title: string, message: string) => {
      notify({ variant: "info", title, message });
    },
    [notify]
  );

  const error = React.useCallback(
    (title: string, message: string) => {
      notify({ variant: "error", title, message });
    },
    [notify]
  );

  const warn = React.useCallback(
    (title: string, message: string) => {
      notify({ variant: "warn", title, message });
    },
    [notify]
  );

  const success = React.useCallback(
    (title: string, message: string) => {
      notify({ variant: "success", title, message });
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

  React.useEffect(() => {
    notificationService.setContext(notification);
    console.log("Notification context set successfully");
  }, [notification]);

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
