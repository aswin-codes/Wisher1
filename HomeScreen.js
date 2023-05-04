import { NativeBaseProvider, Box, Text, VStack, Center, HStack, Switch, Heading, ScrollView, Flex, Actionsheet, useDisclose, Input, Button, Image, FormControl, Alert } from "native-base";
import Icon from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Item from './components/Item';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification"
const UUID = require('uuid-int');


function HomeScreen() {

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [base64, setBase64] = useState(null);
  const [data, setData] = useState({ assets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stat, setStat] = useState("error");

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

  const handleChannel = () => {
    PushNotification.createChannel(
      {
        channelId: "wisher",
        channelName: "Wisher Channel"
      }
    )
  }

  useEffect(() => {
    handleChannel();
    FetchData();
  }, []);



  const isDarkMode = useColorScheme() === 'dark';
  //Styles
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#010001' : '#EEEEEE',
    flex: 1,
    paddingTop: 5
  };

  const titleStyle = {
    fontFamily: 'Qartella-Bold',
    fontSize: 45,
    height: 45,
    paddingTop: 30,
    paddingLeft: 10,
    color: isDarkMode ? '#FFFFFF' : '#010001'
  }

  const getDate = (jsDate) => {
    if (typeof (jsDate) == 'string') {
      jsDate = new Date(jsDate)
    }
    var date = parseInt(jsDate.getDate());
    if (date < 10) {
      date = "0" + date.toString();
    }
    else {
      date = date.toString();
    }
    var month = parseInt(jsDate.getMonth());
    if (month < 9) {
      month = "0" + (month + 1).toString();
    }
    else {
      month = (month + 1).toString();
    }
    var year = jsDate.getFullYear().toString();
    return date + " - " + month + " - " + year
  }

  const getTime = (jsDate) => {
    if (typeof (jsDate) == 'string') {
      jsDate = new Date(jsDate)
    }
    var minute = parseInt(jsDate.getMinutes());
    if (minute < 10) {
      minute = "0" + minute.toString();
    }
    else {
      minute = minute.toString();
    }
    var hour = parseInt(jsDate.getHours())
    if (hour < 10) {
      hour = "0" + hour.toString();
    }
    else {
      hour = hour.toString();
    }
    return hour + " : " + minute
  }

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  useEffect(() => {
    const StoreData = async () => {
      try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem("data", jsonData);
      } catch (e) {
        console.log(e);
      }
    }
    StoreData();
    data.assets.map((i) => {
      console.log(i.date);
    })
    //console.log(data);
  }, [data])

  const deleteNotifications = () => {
    //Notifications.cancelAllScheduledNotificationsAsync()
    PushNotification.cancelAllLocalNotifications();
    console.log("Cancelled All Notifications");
  }

  const getAll = () => {
    PushNotification.getScheduledLocalNotifications((e)=>{
      console.log("Notifications : ",e);
    });
  
  }

  const deleteData = () => {
    setData({ assets: [] });
  }

  const handleTitle = text => setTitle(text)

  const onChange = (event, selectedDate) => {
    selectedDate.setSeconds(0);
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const getKey = () => {
    var listOfData = data.assets;
    var res = true;
    const id = 0;
    const generator = UUID(id);
    var key = parseInt(generator.uuid().toString().slice(-9));
    console.log("Key Generated : ", key);
    for (let i = 0; i < listOfData.length; i++) {
      if (key == listOfData[i].key) {
        res = false;
        break;
      }
    }
    if (res) {
      return key
    }
    else {
      return uuidv4();
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   quality: 1,
    //   allowsMultipleSelection: false,
    // });

    // console.log(result.assets[0].uri);

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    //   var a = await imageToBase64(result.assets[0].uri);
    //   //console.log(a);
    //   setBase64(a);
    // }
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1
      },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setImage(response.assets[0].uri)
          const imageBase64 = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
          //console.log(imageBase64)
          setBase64(imageBase64);
          // You can use the response.uri to display the selected image
          //setImageURI();
          //const imageBase64 = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
          //setImageURI(imageBase64);
          //console.log(imageBase64)
          //await AsyncStorage.setItem("myImage", imageBase64);
          //const imageBase = await AsyncStorage.getItem('myImage');
          //const imagePath = `${RNFetchBlob.fs.dirs.CacheDir}/myImage.jpg`;
          //console.log(imagePath);
          //await RNFetchBlob.fs.writeFile(imagePath, imageBase, 'base64')
          //.then((success) => {
          //console.log("File Written");
          //})
          //.catch((e) => console.log(e))
          //setImageURI("file:///"+imagePath);
          //.catch.console.log('response:', response);
        }
      },
    );
  };

  useEffect(() => {
    setMessage(null);

  }, [title, base64])

  const handleCancel = () => {
    onClose();
    setImage(null);
    setTitle('');
    setDate(new Date());
  }

  const handleAdd = () => {
    if (title == '') {
      setMessage("Title can't be empty.")
      setStat("error")
    }
    else if (base64 == null) {
      setMessage("Select an Image for Instagram Story")
      setStat("error")
    }
    else {
      var key = getKey();
      setData(prev => {
        var a = { ...prev }
        a.assets.push({
          title: title,
          date: date,
          image: base64,
          status: true,
          key: key,
        })
        return a
      })
      console.log(date);
      setNotification(key, date, title);
      handleCancel();

    }
  }

  return (
    <NativeBaseProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Box>
          <Text style={titleStyle}>Wisher</Text>
        </Box>
        {/* <VStack space={3}>
          <Button onPress={() => setNotification(2147483647, new Date(Date.now() + 10 * 1000), "Hi")}>Press</Button>
          <Button colorScheme="error" onPress={deleteNotifications}>Delete All Notifications</Button>
          <Button colorScheme="error" onPress={deleteData}>Delete All Data</Button>
          <Button colorScheme="error" onPress={getAll}>Get All Notifications</Button>
        </VStack> */}
        <ScrollView>
          {
            (data.assets.length == 0)
              ?
              <VStack height={0.7 * Dimensions.get('window').height} paddingTop='15px' paddingBottom="20px" justifyContent="center" alignItems="center">
                <Text textAlign="center" color="gray.600" w="60%">No wishes added yet. Click the plus icon to add one</Text>
              </VStack>
              :
              <VStack paddingTop='15px' paddingBottom="20px" space={4} alignItems='center'>
                {
                  data.assets.map((element) => <Item key={element.key} title={element.title} status={element.status} time={getTime(element.date)} date={getDate(element.date)} />)
                }

              </VStack>
          }

        </ScrollView>
        <Flex alignItems="center" h="8%" w="100%" bgColor={isDarkMode ? '#010001' : '#EEEEEE'} >
          <TouchableOpacity onPress={onOpen}><Icon name="pluscircle" size={60} color='#0487D9' style={{ bottom: 20 }} /></TouchableOpacity>
        </Flex>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'} height="600px">
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text fontSize="25" color={isDarkMode ? "#EEEEEE" : "gray.600"} >
                Add a Wish !
              </Text>
            </Box>
            <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'} >
              <Input value={title} color={isDarkMode ? "white" : "black"} onChangeText={handleTitle} fontSize={20} fontFamily={'Roboto-Regular'} placeholder='Add a title' width={0.85 * Dimensions.get('window').width} />
            </Actionsheet.Item>
            <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
              <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between" alignItems="center">
                <FormControl width={0.39 * Dimensions.get('window').width}>
                  <Button fontSize="25px" leftIcon={<Icon color="#0487D9" size={30} style={{ marginRight: 20, marginLeft: 10 }} name='calendar' />} size='md' variant="outline" onPress={showDatepicker} ><Text marginRight="10px" color="#0487D9">{getDate(date)}</Text></Button>
                  <FormControl.HelperText>Select Date for wish</FormControl.HelperText>
                </FormControl>
                <FormControl width={0.40 * Dimensions.get('window').width}>
                  <Button paddingRight="10px" leftIcon={<Icon color="#0487D9" size={30} name='clockcircleo' style={{ marginRight: 20 }} />} size='md' variant="outline" onPress={showTimepicker}  ><Text marginRight="20px" color="#0487D9">{getTime(date)}</Text></Button>
                  <FormControl.HelperText>Enter time for the notification</FormControl.HelperText>
                </FormControl>
              </HStack>
            </Actionsheet.Item>
            <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
              <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between">
                <Button backgroundColor="#0487D9" height="10" onPress={pickImage}> Select Image</Button>
                {image && <Image resizeMode='contain' alt='Image' source={{ uri: image }} style={{ width: 108, height: 192 }} />}
              </HStack>
            </Actionsheet.Item>

            <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
              <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between"  >
                <Button onPress={handleCancel} backgroundColor="danger.600" w="20">Cancel</Button>
                <Button onPress={handleAdd} backgroundColor="#0487D9" w="20"><Text fontFamily="Roboto" fontSize="16px" color="white" >Add</Text></Button>
              </HStack>
            </Actionsheet.Item>
            {
              message && <Actionsheet.Item>
                <HStack width={0.85 * Dimensions.get('window').width} justifyContent="center">
                  <Alert status={stat} colorScheme={stat}>
                    <HStack space={2} justifyContent="space-between" >
                      <Alert.Icon />
                      <Text>{message}</Text>
                    </HStack>
                  </Alert>
                </HStack>
              </Actionsheet.Item>
            }

          </Actionsheet.Content>
        </Actionsheet>


      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
