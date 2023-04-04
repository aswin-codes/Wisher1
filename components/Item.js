import React from 'react'
import { Box, HStack, VStack, Heading, Text, Switch } from 'native-base'
import { useColorScheme } from 'react-native';

const Item = ({title, date, time, status}) => {

    const isDarkMode = useColorScheme() === 'dark';

    const container = {
        backgroundColor: isDarkMode ? "#242525" : "#FEFFFE"
    }
  
    return (
      <Box margin={0} padding="0px" w="90%" bg={ isDarkMode ? "#242525" : "#FEFFFE"} rounded="md" shadow={3}>
              <HStack paddingX="15px"  paddingY="10px"justifyContent="space-between">
                <VStack height="60px" justifyContent="space-between" w="80%" >
                  <Heading color={isDarkMode ? "#F0F0F0" : "#010001"} fontFamily="Roboto-Medium" fontSize="20px"  >{title}</Heading>
                  <HStack w="70%" justifyContent="space-between">
                    <Text color={isDarkMode ? "#BBBBBB" : "#A6A6A6"} fontFamily="Roboto-Regular">{date}</Text>
                    <Text color={isDarkMode ? "#BBBBBB" : "#A6A6A6"} fontFamily="Roboto-Regular">{time}</Text>
                  </HStack>
                </VStack>
                <Switch offThumbColor="#FEFFFE" offTrackColor={isDarkMode ? "#737373" : "#E6E6E6"} onThumbColor="#FEFFFE" onTrackColor={isDarkMode ? "#0487D9" : "#0D84FE"} size="lg" defaultIsChecked={status} />
  
              </HStack>
  
            </Box>
    )
  }
  
  export default Item