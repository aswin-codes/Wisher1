

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';


  const getImage = (key, list) => {
    for (var i=0; i < list.length; i++){
      if (list[i].key == key)
        return [list[i].image,list[i].media];
    }
  }

  

  const setNotification = (key, thedate, title) => {

    console.log(thedate.toLocaleString());
    console.log(key, title);
    console.log(typeof (thedate));

    if (thedate > new Date()){
      console.log("Future");
      PushNotification.localNotificationSchedule({
        id: key,
        channelId: "wisher",
        title: title,
        message: "Hey mate, you got wish remainder!",
        date: thedate,
        allowWhileIdle: true,
        repeatType: "year"
      });
    }
    else {
      console.log("Past");
      thedate.setFullYear(thedate.getFullYear()+1);
      PushNotification.localNotificationSchedule({
        id: key,
        channelId: "wisher",
        title: title,
        message: "Hey mate, you got wish remainder!",
        date: thedate,
        allowWhileIdle: true,
        repeatType: "year"
      });

    }

    
    console.log("Scheduled Notification");
    // Notifications.scheduleNotificationAsync({
    //   identifier: key,
    //   content: {
    //     title: title,
    //     body: "Hey mate, you got wish remainder!"
    //   },
    //   trigger: {
    //     day: parseInt(thedate.getDate()),
    //     month: parseInt(thedate.getMonth()),
    //     hour: parseInt(thedate.getHours()),
    //     minute: parseInt(thedate.getMinutes()),
    //     repeats: true,
    //   }
    // })



  }

PushNotification.configure({
    onNotification: async function (notification) {
        console.log("Notification : ",notification);
        console.log(notification.id);
        var date = new Date(notification.fireDate);
        date.setFullYear(date.getFullYear()+1);
        setNotification(notification.id, date, notification.title);
        var stored = await AsyncStorage.getItem('data');
        stored = JSON.parse(stored)
        var [imageURI,media] = getImage(notification.id, stored.assets);
        //console.log(imageURI);
        if (media == "Instagram"){
          Share.isPackageInstalled('com.instagram.android')
        .then(async ({ isInstalled }) => {
        if (isInstalled){
          await Share.shareSingle({
            stickerImage: imageURI,
            appId: '230235216133934',
            social: Share.Social.INSTAGRAM_STORIES,
            backgroundBottomColor: '#000000',
            backgroundTopColor: '#000000',
          })
        } else {
          await Share.open({ url: imageURI })
        }
        
      })
        .catch((err) => console.error(err));
        } else {
          await Share.open({url: imageURI})
        }
        
        
        // await Share.shareSingle({
        //     stickerImage: imageURI,
        //     appId: '230235216133934',
        //     social: Share.Social.INSTAGRAM_STORIES,
        //     backgroundBottomColor: '#000000',
        //     backgroundTopColor: '#000000',
        // })
        //await Share.open({ url: imageURI })
    },
    requestPermissions: Platform.OS === 'ios'
});

AppRegistry.registerComponent(appName, () => App);
