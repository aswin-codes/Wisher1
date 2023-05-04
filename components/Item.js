import React from 'react'
import { Box, HStack, VStack, Heading, Text, Switch } from 'native-base'
import { useColorScheme, TouchableOpacity } from 'react-native';
import PushNotification from "react-native-push-notification"
import Icon from "react-native-vector-icons/FontAwesome"


const Item = ({title, date, time,  showModal, setShowModal, modifyTitle, modifyImage, modifyDate, image, jsDate, modifyId, id, media, modifyMedia}) => {

    const isDarkMode = useColorScheme() === 'dark';

    const setNotification = (key, thedate, title) => {


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
  
    }

    const handleNotify = () => {
      setNotification(id,new Date(jsDate),title)
    }

  

    

    const  handlePress = async () => {
      modifyTitle(title);
      modifyDate(jsDate);
      setShowModal(!showModal);
      modifyId(id);
      modifyImage(image); 
      modifyMedia(media);     
    }

    function getTitle(string){
      if (string.length > 25){
        return string.substr(0,25) + "..."
      }
      return string
    }

   
  
    return (
      <Box margin={0} padding="0px" w="90%" bg={ isDarkMode ? "#242525" : "#FEFFFE"} rounded="md" shadow={3}>
              <HStack paddingX="15px" alignItems='center'  paddingY="15px" justifyContent="space-between">
                <TouchableOpacity onPress={handlePress} >
                <VStack height="60px" justifyContent="space-between" w="90%" >
                  <Heading fontWeight={700} color={isDarkMode ? "#F0F0F0" : "#010001"} fontFamily="Roboto-Medium" fontSize="20px"  >{getTitle(title)}</Heading>
                  <HStack w="95%" justifyContent="space-between">
                    <Text color={isDarkMode ? "#BBBBBB" : "#A6A6A6"} fontFamily="Roboto-Regular">{date}</Text>
                    <Text color={isDarkMode ? "#BBBBBB" : "#A6A6A6"} fontFamily="Roboto-Regular">{time}</Text>
                    <Text color={isDarkMode ? "#BBBBBB" : "#A6A6A6"} fontFamily="Roboto-Regular">{media}</Text>
                  </HStack>
                </VStack>
                </TouchableOpacity>
                <TouchableOpacity onPress = {handleNotify}>
               <Icon size={25} name="bell-o" color={isDarkMode ? "white" : "black"}/>
               </TouchableOpacity>
              </HStack>
  
            </Box>
    )
  }
  
  export default Item