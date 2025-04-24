import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Notification data interface
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type?: 'warning' | 'alert' | 'suggestion' | 'saving';
  data?: any;
}

class NotificationService {
  constructor() {
    // We no longer need to configure notifications here as it's done in App.tsx
  }

  // Request permissions to show notifications
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Only ask if permissions have not been determined
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for notifications');
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Send an immediate notification
  async sendNotification(notification: NotificationData): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.log('No permission to show notifications');
        return '';
      }
      
      // Set icon based on notification type
      const icon = this.getIconForType(notification.type);
      
      // Log that we're sending a notification (for debugging)
      console.log(`Sending notification: ${notification.title}`);
      
      // Schedule the notification to appear immediately
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          // Don't set badge on iOS as it requires special permissions
          ...(Platform.OS === 'android' ? { 
            channelId: 'financial-insights',
            icon,
            color: '#006A4D'
          } : {})
        },
        trigger: null, // null means show immediately
      });
      
      console.log(`Notification scheduled with ID: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      return '';
    }
  }
  
  // Schedule a notification for a specific time
  async scheduleNotification(
    notification: NotificationData, 
    seconds: number
  ): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.log('No permission to show notifications');
        return '';
      }
      
      // Set icon based on notification type
      const icon = this.getIconForType(notification.type);
      
      console.log(`Scheduling notification in ${seconds} seconds: ${notification.title}`);
      
      // Schedule the notification to appear after specified seconds
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          ...(Platform.OS === 'android' ? { 
            channelId: 'financial-insights',
            icon,
            color: '#006A4D'
          } : {})
        },
        trigger: {
          seconds: seconds,
        },
      });
      
      console.log(`Notification scheduled with ID: ${notificationId} for ${seconds} seconds from now`);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }
  
  // Add a listener for notification received while app is foregrounded
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }
  
  // Add a listener for when user taps on a notification
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
  
  // Cancel all pending notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }
  
  // Create a notification channel for Android
  async createChannel(
    channelId: string, 
    channelName: string, 
    importance: 'high' | 'default' | 'low' = 'default'
  ): Promise<void> {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync(channelId, {
          name: channelName,
          importance: 
            importance === 'high' 
              ? Notifications.AndroidImportance.HIGH 
              : importance === 'low'
                ? Notifications.AndroidImportance.LOW
                : Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#006A4D',
        });
        console.log(`Created notification channel: ${channelName}`);
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    }
  }
  
  // Get the appropriate icon name based on notification type
  private getIconForType(type?: 'warning' | 'alert' | 'suggestion' | 'saving'): string {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'alert':
        return 'error';
      case 'suggestion':
        return 'lightbulb';
      case 'saving':
        return 'savings';
      default:
        return 'notifications';
    }
  }

  // Get all scheduled notifications (for debugging)
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
  
  // Present a notification immediately (use this for guaranteed notification display)
  async presentNotificationImmediately(notification: NotificationData): Promise<void> {
    try {
      await Notifications.presentNotificationAsync({
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        ...(Platform.OS === 'android' ? { 
          channelId: 'financial-insights',
          color: '#006A4D'
        } : {})
      });
      console.log('Presented notification immediately');
    } catch (error) {
      console.error('Error presenting notification:', error);
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();