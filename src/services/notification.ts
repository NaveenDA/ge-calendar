// browser notification
class NotificationService {

    // show notification
    public static show(title: string, message: string, icon: string, timeout: number = 5000): void {
        if(NotificationService.isSupported() && NotificationService.isGranted()) {
        const notification = new Notification(title, {
            body: message,
            icon,
            silent: true,
            requireInteraction: true,
            renotify: true,
            vibrate: [200, 100, 200],
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
    public static requestPermission(): void {
        Notification.requestPermission();
    }

}


export default NotificationService;