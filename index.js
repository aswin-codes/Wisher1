

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import  AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const FetchData = async () => {
    setIsLoading(true);
    try {
      var stored = await AsyncStorage.getItem('data');
      stored = JSON.parse(stored)
      //console.log(stored.assets,1)
      if ((stored == null) || (stored.assets == [])) {
        console.log("No data inside local storage")//need to remove during production
        setIsLoading(false);
      }
      else if (stored.assets == []) {
        console.log("No data inside local storage but not first time")//need to remove during production
        setIsLoading(false);
      }
      else {
        console.log(stored.assets[0].key)
      
        setData(stored)
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const getBase64 = (key, list) => {
    for (var i=0; i < list.length; i++){
      if (list[i].key == key)
        return list[i].image;
    }
  }

  const setNotification = (key, thedate, title) => {

    console.log(thedate.toLocaleString());
    console.log(key, title);
    console.log(typeof (thedate));

    PushNotification.localNotificationSchedule({
      id: key,
      channelId: "wisher",
      title: title,
      message: "Hey mate, you got wish remainder!",
      date: thedate,
      allowWhileIdle: true,
      repeatType: "year"
    });
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
        var base64 = getBase64(notification.id, stored.assets);
        //console.log(base64);
        await AsyncStorage.setItem("myImage", base64);
        const imageBase = await AsyncStorage.getItem('myImage');
        //console.log(imageBase)
        const imagePath = `${RNFetchBlob.fs.dirs.CacheDir}/myImage.jpg`;
        await RNFetchBlob.fs.writeFile(imagePath, imageBase, 'base64')
        .then((success) => {
            console.log("File Written");
          }).catch((e) => console.log(e))
        var imageURI = "file:///"+imagePath;
        console.log(imageURI)
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
