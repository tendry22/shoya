import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Modal, TouchableOpacity } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      <Modal
        visible={showAlert}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            marginTop: '5%', // Espacement par rapport au haut de l'écran (5% de la hauteur de l'écran)
          }}
          onPress={() => setShowAlert(false)}
        >
          <View
            style={{
              backgroundColor: 'black', // Couleur de fond noire
              padding: 20,
              borderRadius: 10,
              marginLeft: '10%', 
              width: '80%', // Largeur du modal (80% de la largeur de l'écran)
            }}
          >
            <Text style={{ color: 'white' }}>{notification && notification.request.content.title}</Text>
            <Text style={{ color: 'white' }}>{notification && notification.request.content.body}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'e0f1f157-a4e0-48fc-aa11-0602a7b882c6' })).data;
    console.log(token);
  } else {
    console.error('Must use physical device for Push Notifications');
  }

  return token;
}