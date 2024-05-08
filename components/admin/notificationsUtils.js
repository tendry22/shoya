// notificationsUtils.js

import * as Notifications from 'expo-notifications';

/**
 * Planifie une notification pour une heure spécifiée.
 * @param {Object} content - Contenu de la notification.
 * @param {Object} trigger - Déclencheur de la notification.
 */
export async function schedulePushNotification(content, trigger) {
  await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}

/**
 * Envoie une notification à un token spécifié.
 * @param {string} token - Jeton d'Expo pour l'appareil de destination.
 * @param {string} title - Titre de la notification.
 * @param {string} body - Corps de la notification.
 */
export async function sendPushNotification(token, title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      to: token,
      title,
      body,
    },
    trigger: null,
  });
}
