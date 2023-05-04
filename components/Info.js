import { View, useColorScheme, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { NativeBaseProvider, Heading, Text } from 'native-base'


const Info = () => {

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#010001' : '#EEEEEE',
        flex: 1,
        paddingLeft: 10
      };

  return (
    <NativeBaseProvider>
      <View style={backgroundStyle}>
        <ScrollView>
        <Heading color={isDarkMode ? "#FFFFFF" : "#000000"}>Wisher</Heading>
        <Text padding={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>
        Welcome to Wisher, an application that reminds you of your friends' and family members' birthday by sending notification and automatically opens instagram story or other social media by clicking them. By using this app, you agree to the following terms and conditions:
        </Text>
        <Heading color={isDarkMode ? "#FFFFFF" : "#000000"}>Known Edge Cases</Heading>
        <Text paddingX={3} paddingTop={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👉Due to the local notification setup, if you miss clicking the (reacting to) notification, the notification for the next year won't be scheduled. If you miss to click the notification, just click the bell icon on the HomeScreen assigned to each wishes, to schedule for the next year.</Text>        
        <Text paddingX={3} paddingTop={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👉If you delete the image after assigning it in the app, the image won't be shared on the instagram stories even if you click the notification.</Text>
        <Text paddingX={3} paddingY={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👉If you want to edit the wish (changing title, date or image) or even deleting the wish, just click on the title of respective wish on the home screen.</Text>
        
        <Heading color={isDarkMode ? "#FFFFFF" : "#000000"}>Privacy</Heading>
        <Text paddingX={3} paddingTop={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👍Wisher will collect and store the birthdays of your contacts locally in your device.</Text>
        <Text paddingX={3}  color={isDarkMode ? "#FFFFFF" : "#000000"} >👍We don't have access to share this information with third parties</Text>
        <Text paddingX={3}  paddingBottom={3} color={isDarkMode ? "#FFFFFF" : "#000000"} >👍We may use this information to send you notifications and reminders about upcoming birthdays.</Text>
        <Heading color={isDarkMode ? "#FFFFFF" : "#000000"}>User Conduct</Heading>
        <Text paddingX={3} paddingTop={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👍Wisher is owned and operated by Softzin</Text>
        <Text paddingX={3}  color={isDarkMode ? "#FFFFFF" : "#000000"} >👍All content, logos, and trademarks used in the app are the property of Softzin.</Text>
        <Text paddingX={3}  paddingBottom={3} color={isDarkMode ? "#FFFFFF" : "#000000"} >👍You agree not to copy, reproduce, or modify any part of the app without our written consent.</Text>
        <Heading color={isDarkMode ? "#FFFFFF" : "#000000"}>Disclaimer of Liability</Heading>
        <Text paddingX={3} paddingTop={3}  color={isDarkMode ? "#FFFFFF" : "#000000"}>👍Wisher is provided on an "as is" and "as available" basis.</Text>
        <Text paddingX={3}  paddingBottom={3} color={isDarkMode ? "#FFFFFF" : "#000000"} >👍We do not guarantee that the app will be error-free or uninterrupted.</Text>
        <TouchableOpacity onPress={()=> Linking.openURL('https://www.instagram.com/softzin.devs')}>
        <Text  marginTop={5} color={isDarkMode ? '#E0E0E0' : 'grey.900'} textAlign='center'>Designed and developed by Softzin</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  )
}

export default Info