import type { NotificationOptions } from "./NotificationProvider";

class NotificationService {
  private static instance: NotificationService;
  private notificationContext: any = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setContext(context: any) {
    this.notificationContext = context;
  }

  private getContext() {
    if (!this.notificationContext) {
      console.warn('Notification context not set. Make sure NotificationProvider is properly initialized.');
      return null;
    }
    return this.notificationContext;
  }

  notify(options: NotificationOptions) {
    this.getContext()?.notify(options);
  }

  info(message: string, title: string) {
    this.getContext()?.info(message, title);
  }

  error(message: string, title: string) {
    this.getContext()?.error(message, title);
  }

  warn(message: string, title: string) {
    this.getContext()?.warn(message, title);
  }

  success(message: string, title: string) {
    this.getContext()?.success(message, title);
  }
}

export const notificationService = NotificationService.getInstance();