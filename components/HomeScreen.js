import { NativeBaseProvider, Box, Text, VStack, Center, HStack, Switch, Heading, ScrollView, Flex, Actionsheet, useDisclose, Input, Button, Image, FormControl, Alert, Modal, Skeleton, Radio } from "native-base";
import Icon from 'react-native-vector-icons/AntDesign';
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';

import Item from './Item';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification"
const UUID = require('uuid-int');



function HomeScreen({ navigation }) {

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [base64, setBase64] = useState(null);
  const [data, setData] = useState({ assets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [stat, setStat] = useState("error");
  const [id, setId] = useState(null);
  const [media, setMedia] = useState('Instagram');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon.Button onPress={() => navigation.navigate("Info")} name="infocirlceo" backgroundColor={isDarkMode ? '#010001' : "#EEEEEE"} color={isDarkMode ? "#ffffff" : "#000000"} />
      ),
    });
  }, [navigation]);

  


  const modifyMedia = (val) => {
    setMedia(val)
  }
  const modifyId = (val) => {
    console.log("Value")
    setId(val);
  }

  const modifyTitle = (string) => {
    setTitle(string);
  }
  const modifyDate = (string) => {
    setDate(new Date(string));
  }
  const modifyImage = (string) => {
    setImage(string);
  }

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

  const deleteIdNotification = (id) => {
    PushNotification.cancelLocalNotification(id);
  }

  const setNotification = (key, thedate, title) => {


    if (thedate > new Date()) {
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
      thedate.setFullYear(thedate.getFullYear() + 1);
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
    setIsLoading(false);
  }, []);



  const isDarkMode = useColorScheme() === 'dark';
  //Styles
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#010001' : '#EEEEEE',
    flex: 1,
    paddingTop: 5
  };



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
    var AmOrPm = hour >= 12 ? 'PM' : 'AM';
    hour = (hour % 12) || 12;
    if (hour < 10) {
      hour = "0" + hour.toString();
    }
    else {
      hour = hour.toString();
    }
    return hour + " : " + minute + " " + AmOrPm
  }

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();


  useEffect(() => {
    console.log("Stored")
    const StoreData = async () => {
      try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem("data", jsonData);
      } catch (e) {
        console.log(e);
      }
    }
    StoreData();
    // data.assets.map((i) => {
    //   console.log(i.date);
    // })
    // console.log(data);
  }, [data])

  const deleteNotifications = () => {
    //Notifications.cancelAllScheduledNotificationsAsync()
    PushNotification.cancelAllLocalNotifications();
    console.log("Cancelled All Notifications");
  }

  const getAll = () => {
    PushNotification.getScheduledLocalNotifications((e) => {
      console.log("Notifications : ", e);
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
      is24Hour: false,
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
          //const imageBase64 = await RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64');
          //console.log(imageBase64)
          //setBase64(imageBase64);
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
    else if (image == null) {
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
          image: image,
          key: key,
          media: media
        })
        return a
      })
      console.log(date);
      setNotification(key, date, title);
      handleCancel();

    }
  }

  const [showModal, setShowModal] = useState(false);

  const handleDelete = (key) => {

    setData((prev) => {
      var old = { ...prev };
      var oldList = old.assets;
      let index = oldList.findIndex(obj => (obj.key == key))
      oldList.splice(index, 1);
      old.assets = oldList;
      return old
    })
    deleteIdNotification(key);
    setImage(null);
    setTitle('');
    setDate(new Date());
    setShowModal(false)

  }

  const updateData = (key) => {
    setData((prev) => {
      var old = { ...prev }
      var oldList = old.assets
      var myObject = oldList.find(it => (it.key == key))
      console.log(myObject);
      myObject.title = title;
      myObject.date = date;
      myObject.image = image;
      myObject.media = media;
      oldList = oldList.map(it => {
        if (it.key == key) {
          return myObject
        }
        return it
      });
      old.assets = oldList;
      return old
    })
    deleteIdNotification(key);
    setNotification(key, date, title);
    setImage(null);
    setTitle('');
    setDate(new Date());
    setShowModal(false)
  }


  return (
    <NativeBaseProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <VStack space={3}>
          <Button onPress={() => setNotification(2147483647, new Date(Date.now() + 10 * 1000), "Hi")}>Press</Button>
          <Button colorScheme="error" onPress={deleteNotifications}>Delete All Notifications</Button>
          <Button colorScheme="error" onPress={deleteData}>Delete All Data</Button>
          <Button colorScheme="error" onPress={getAll}>Get All Notifications</Button>
        </VStack>
        {
          isLoading
            ?
            <View height={0.80 * Dimensions.get('window').height}>
              <VStack space={4} paddingX={3}>
                <Skeleton h="20" borderRadius={10} />
                <Skeleton h="20" borderRadius={10} />
                <Skeleton h="20" borderRadius={10} />
              </VStack>
            </View>
            :
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
                      data.assets.map((element) => <Item showModal={showModal} setShowModal={setShowModal} modifyTitle={modifyTitle} modifyDate={modifyDate} modifyImage={modifyImage} jsDate={element.date} image={element.image} modifyId={modifyId} key={element.key} id={element.key} title={element.title} media={element.media} time={getTime(element.date)} date={getDate(element.date)} modifyMedia={modifyMedia} />)

                    }

                  </VStack>
              }

            </ScrollView>

        }

        <Flex alignItems="center" h="8%" w="100%"  >
          <TouchableOpacity style={{ height: 60 }} onPress={onOpen}><Icon name="pluscircle" size={60} color='#0487D9' style={{ bottom: 20 }} /></TouchableOpacity>
        </Flex>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'} height="600px">
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text fontSize="25" color={isDarkMode ? "#EEEEEE" : "gray.600"} >
                Add a Wish !
              </Text>
            </Box>
            <ScrollView>
              <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'} >
                <Input value={title} color={isDarkMode ? "white" : "black"} onChangeText={handleTitle} fontSize={20} fontFamily={'Roboto-Regular'} placeholder='Add a title' width={0.85 * Dimensions.get('window').width} />
              </Actionsheet.Item>
              <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
                <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between" alignItems="center">
                  <FormControl width={0.39 * Dimensions.get('window').width}>
                    <Button fontSize="25px" leftIcon={<Icon color="#0487D9" size={30} style={{ marginRight: 5, marginLeft: 10 }} name='calendar' />} size='md' variant="outline" onPress={showDatepicker} ><Text marginRight="10px" color="#0487D9">{getDate(date)}</Text></Button>
                    <FormControl.HelperText>Select Date for wish</FormControl.HelperText>
                  </FormControl>
                  <FormControl width={0.40 * Dimensions.get('window').width}>
                    <Button paddingRight="10px" leftIcon={<Icon color="#0487D9" size={30} name='clockcircleo' style={{ marginRight: 20 }} />} size='md' variant="outline" onPress={showTimepicker}  ><Text marginRight="20px" color="#0487D9">{getTime(date)}</Text></Button>
                    <FormControl.HelperText>Enter time for the notification</FormControl.HelperText>
                  </FormControl>
                </HStack>
              </Actionsheet.Item>
              <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
                <Radio.Group value={media} onChange={(next) => setMedia(next)}>
                  <FormControl>
                    <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between" alignItems="center">
                      <Radio value="Instagram" _pressed={{ backgroundColor: "#0487D9" }} my={1}>
                        <Text color={isDarkMode ? "white" : "black"}>Instagram (Story)</Text>
                      </Radio>
                      <Radio value="Others" color={isDarkMode ? "white" : "black"} _pressed={{ backgroundColor: "#0487D9" }} my={1}>
                        <Text color={isDarkMode ? "white" : "black"}>Others</Text>
                      </Radio>
                    </HStack>
                    <FormControl.HelperText>Select the media that you use for wishing</FormControl.HelperText>
                  </FormControl>
                </Radio.Group>
              </Actionsheet.Item>
              <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
                <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between">
                  <Button backgroundColor="#0487D9" height="10" onPress={pickImage}> Select Image</Button>
                  {image && <Image resizeMode='contain' alt='Image' source={{ uri: image }} style={{ width: 90, height: 160 }} />}
                </HStack>
              </Actionsheet.Item>

              <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
                <HStack width={0.85 * Dimensions.get('window').width} justifyContent="space-between"  >
                  <Button onPress={handleCancel} backgroundColor="danger.600" w="20">Cancel</Button>
                  <Button onPress={handleAdd} backgroundColor="#0487D9" w="20"><Text fontFamily="Roboto" fontSize="16px" color="white" >Add</Text></Button>
                </HStack>
              </Actionsheet.Item>
              {
                message && <Actionsheet.Item backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
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
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}
            width={0.85 * Dimensions.get('window').width}>
            <Modal.CloseButton />
            <Modal.Header backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}><Text color={isDarkMode ? "white" : "black"} fontSize={25}>Edit</Text ></Modal.Header>
            <Modal.Body>
              <VStack width={0.80 * Dimensions.get('window').width} >
                <FormControl>
                  <FormControl.Label>Title</FormControl.Label>
                  <Input value={title} onChangeText={setTitle} fontSize={15} color={isDarkMode ? "white" : "black"} width={0.75 * Dimensions.get('window').width} />
                </FormControl>
                <HStack width={0.75 * Dimensions.get('window').width} justifyContent='space-between'>
                  <FormControl width={0.34 * Dimensions.get('window').width}>
                    <FormControl.Label>Date</FormControl.Label>
                    <Button fontSize="20px" leftIcon={<Icon color="#0487D9" size={24} style={{ marginRight: 0, marginLeft: 0, paddingLeft: 2, }} name='calendar' />} size='md' variant="outline" onPress={showDatepicker} ><Text marginRight="0px" color="#0487D9">{getDate(date)}</Text></Button>

                  </FormControl>
                  <FormControl width={0.34 * Dimensions.get('window').width}>
                    <FormControl.Label>Time</FormControl.Label>
                    <Button paddingLeft="0px" leftIcon={<Icon color="#0487D9" size={24} name='clockcircleo' style={{ marginRight: 0 }} />} size='md' variant="outline" onPress={showTimepicker}  ><Text marginRight="0px" color="#0487D9">{getTime(date)}</Text></Button>

                  </FormControl>
                </HStack>
                <Radio.Group value={media} onChange={(next) => setMedia(next)}>
                  <FormControl>
                    <FormControl.Label>Media</FormControl.Label>
                    <HStack width={0.75 * Dimensions.get('window').width} justifyContent="space-between" alignItems="center">
                      <Radio value="Instagram" _pressed={{ backgroundColor: "#0487D9" }} my={1}>
                        <Text color={isDarkMode ? "white" : "black"}>Instagram (Story)</Text>
                      </Radio>
                      <Radio value="Others" color={isDarkMode ? "white" : "black"} _pressed={{ backgroundColor: "#0487D9" }} my={1}>
                        <Text color={isDarkMode ? "white" : "black"}>Others</Text>
                      </Radio>
                    </HStack>
                  </FormControl>
                </Radio.Group>
                <FormControl>
                  <FormControl.Label>Image</FormControl.Label>
                  <HStack width={0.75 * Dimensions.get('window').width} justifyContent="space-between">
                    <Button backgroundColor="#0487D9" height="10" onPress={pickImage}> Select Image</Button>
                    {image && <Image resizeMode='contain' alt='Image' source={{ uri: image }} style={{ width: 90, height: 160 }} />}
                  </HStack>
                </FormControl>
                <Button width={0.78 * Dimensions.get('window').width} bgColor="danger.800" onPress={handleDelete}>Delete</Button>
              </VStack>
            </Modal.Body>
            <Modal.Footer backgroundColor={isDarkMode ? '#242525' : '#EEEEEE'}>
              <HStack width={0.78 * Dimensions.get('window').width} justifyContent="space-between">
                <Button variant="outline" colorScheme="blueGray" onPress={() => {
                  setShowModal(false);
                  setImage(null);
                  setTitle('');
                  setDate(new Date());
                }}>
                  Cancel
                </Button>
                <Button backgroundColor="#0487D9" onPress={() => {
                  updateData(id);
                }}>
                  Save
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>



      </SafeAreaView>
    </NativeBaseProvider>
  );
}

export default HomeScreen;
