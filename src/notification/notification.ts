import type { NotificationOptions } from "./NotificationProvider";

class NotificationService {
  private static instance: NotificationService;
  private notificationContext: any = null;

  private constructor() { }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setContext(context: any) {
    this.notificationContext = context;
    console.log("NotificationService context received:", !!context);
  }

  private getContext() {
    if (!this.notificationContext) {
      console.warn('Notification context not set. Make sure NotificationProvider is properly initialized.');
      return null;
    }
    return this.notificationContext;
  }

  notify(options: NotificationOptions) {
    const context = this.getContext();
    console.log('Calling notify with context:', !!context, 'options:', options);
    context?.notify(options);
  }

  info(title: string, message: string) {
    const context = this.getContext();
    console.log('Calling info with context:', !!context, 'title:', title);
    context?.info(title, message);
  }

  error(title: string, message: string) {
    const context = this.getContext();
    console.log('Calling error with context:', !!context, 'title:', title);
    context?.error(title, message);
  }

  warn(title: string, message: string) {
    const context = this.getContext();
    console.log('Calling warn with context:', !!context, 'title:', title);
    context?.warn(title, message);
  }

  success(title: string, message: string) {
    const context = this.getContext();
    console.log('Calling success with context:', !!context, 'title:', title);
    context?.success(title, message);
  }
}

export const notificationService = NotificationService.getInstance();