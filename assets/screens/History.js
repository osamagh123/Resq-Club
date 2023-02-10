import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { Button, FlatList } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function History() {

    var uniqueId = DeviceInfo.getUniqueId();
    const [catData,setCatData] = useState([])
    const windowWidth = Dimensions.get('window').width - 40 ;
    const [repeater,setRepeater]=useState(0);
    const navigation = useNavigation();
    const width = Dimensions.get('window').width;

    useEffect(() => {
      const ReadData = async() => {
          var data = [];
          try{
              const getPost = await firestore()
              .collection('Cats')
              .where('userId','==', uniqueId)
              .get()
              .then((querySnapshot) => {
                  querySnapshot.docs.forEach((doc) => {
                      data.push({...doc.data().imageId})
                  })
                    var simpleArray = data.length > 0 ? Object.values(data[0]) : [];
                    setCatData(simpleArray)
              })
          }
          catch(error){
              console.log(error)
          }
      }
      ReadData();
      
      setTimeout(() => setRepeater(prevState=>prevState+1), 1000);

    }, [repeater])

    const renderItem = ({item}) => {
        const onPressHandler = async () => {
            const data = await firestore()
              .collection('Cats')
              .where('userId', '==', uniqueId)
              .get();

                firestore()
                  .collection('Cats')
                  .doc(data.docs[0].id)
                  .update({
                    imageId: firestore.FieldValue.arrayRemove(item),
                  })
                  .then(() => {
                    console.log('Success');
                  })
                  .catch((error) => {
                    alert(error);
                  });
              }
            
        return(
            <View style={{width: windowWidth,  margin: 20,}}>
                <Image source={{ uri: 'https://placekitten.com/200/200?image=' + item}} style={{width: windowWidth, height: windowWidth, marginBottom: 10,}} />
                <Button onPress={onPressHandler}>Remove from "Not So Cute"</Button>
            </View>
        )
    }
    
  return (
    <SafeAreaView>
      <View p='2'>
        <Button bgColor='transparent' w='60' onPress={() => {navigation.navigate('Home')}}><Text color='black'>Back</Text></Button>
        <View mt='20'>
            <GestureHandlerRootView>
            <Carousel
                width={width}
                data={catData}
                renderItem={renderItem}
            />
            </GestureHandlerRootView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})