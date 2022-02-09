const notifcationIcon = require("../assets/notification.jpg");
// browser notification
class NotificationService {
  // show notification
  public static show(
    title: string,
    message: string,
    icon: string = notifcationIcon,
    timeout: number = 5000
  ): void {
    if (NotificationService.isSupported() && NotificationService.isGranted()) {
      const notification = new Notification(title, {
        body: message,
        icon,
        requireInteraction: true,
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      setTimeout(() => {
        notification.close();
      }, timeout);
    }
  }

  // check if browser supports notifications
  public static isSupported(): boolean {
    return "Notification" in window;
  }

  // check if user has granted permission to show notifications
  public static isGranted(): boolean {
    return Notification.permission === "granted";
  }

  // request permission to show notifications
  public static requestPermission() {
    return Notification.requestPermission();
  }
}

export default NotificationService;
