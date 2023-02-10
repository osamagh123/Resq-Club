import { SafeAreaView, StyleSheet,  FlatList, Image, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { Button, Text, View, } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

export default function Home() {
  const array1 = Array.from({ length: 16 }, (_, i) => i + 1);
  const [catData,setCatData] = useState([])

const windowWidth = Dimensions.get('window').width - 40 ;

var uniqueId = DeviceInfo.getUniqueId();
const [repeater,setRepeater]=useState(0);

const navigation = useNavigation();
const width = Dimensions.get('window').width;


useEffect(() => {
  const ReadData = async() => {
    var data = [];
    try{
      const getPost = await firestore()
      .collection('Cats')
      .where('userId','==',uniqueId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          data.push({...doc.data().imageId})
        })
        var simpleArray = data.length > 0 ? Object.values(data[0]) : [];
        var finalData = array1.filter(function(element){
          return !simpleArray.includes(element);
        })
        setCatData(finalData);
      })
    }
    catch(error){
      console.log(error)
    }
  }
  ReadData()

  setTimeout(() => setRepeater(prevState=>prevState+1), 1000);

}, [repeater])

const [showUndo, setShowUndo] = useState(false);
const [timerId, setTimerId] = useState(null);

const renderItem = ({item}) => {


  const onPressHandler = async () => {
    setShowUndo(true);
    const timeoutId = setTimeout(() => {
      setShowUndo(false);
      addDataToFirestore();
    }, 5000);
    setTimerId(timeoutId);
  };

  const undoHandler = () => {
    setShowUndo(false);
    clearTimeout(timerId);
  };

  const addDataToFirestore = async () => {
    const data = await firestore()
      .collection('Cats')
      .where('userId', '==', uniqueId)
      .get();
  
    if (data.empty) {
      firestore()
        .collection('Cats')
        .add({
          imageId: firestore.FieldValue.arrayUnion(item),
          userId: uniqueId,
        })
        .then(() => {
          console.log('Success');
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      const currentDoc = data.docs[0].data();
      if (currentDoc.imageId.indexOf(item) === -1) {
        firestore()
          .collection('Cats')
          .doc(data.docs[0].id)
          .update({
            imageId: firestore.FieldValue.arrayUnion(item),
          })
          .then(() => {
            console.log('Success');
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
  };

  return (
    <View style={{width: windowWidth, margin: 20}}>
      <Image
        source={{uri: 'https://placekitten.com/200/200?image=' + item}}
        style={{width: windowWidth, height: windowWidth, marginBottom: 10}}
      />
      <Button onPress={onPressHandler}>Not Cute Enough</Button>
      {showUndo && <Button bgColor='red.600' mt='5' onPress={undoHandler}>Undo</Button>}
    </View>
  );
};


  return (
    <SafeAreaView>
      <View>
        <View p='2' alignItems='flex-end'>
          <Button onPress={() => {navigation.navigate('History')}} bgColor='transparent' borderColor='black' borderWidth='1' w='140'><Text color='black'>Preferences</Text></Button>
        </View>
        <View>
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