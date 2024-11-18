import { View, SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import Icons from 'react-native-vector-icons/AntDesign';
// import { Picker } from '@react-native-picker/picker';



// const [timeData, setTime ] = useState();
// [
//   { id: '1', value: '10.00-12.00' },
//   { id: '2', value: '12.00-14.00' },
//   { id: '3', value: '14.00-16.00' },
//   { id: '4', value: '18.00-20.00' },

// ]

const swimmingPool_bar = require("../img/tapbar_swim.png")
const swimmingPool_icon = require("../img/swimming_icon.png")





const SwimBooking_page = ({navigation} :{navigation : any}) => {
 
  const back = () => navigation.navigate("Home");
  const payment = () => navigation.navigate("SwimPayment");
  return (
    <SafeAreaView style={styles.contenner_page}>
      <View>
        <View style={styles.barArea}>
          <Image source={swimmingPool_bar} resizeMode='cover' style={styles.swimmingPool_bar}></Image>
        </View>
        <View>
          <TouchableOpacity onPress={back}>
            <View style={styles.buttonInBox}>
              <Icons name="left" size={20} />
              <Text style={styles.buttonText}>Go back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.topArea}>
            <View style={styles.containerBox1}>
              <Text style={styles.text1}>Swimming Pool</Text>
              <Text style={styles.text1}>Booking</Text>
            </View>

            <View style={styles.containerSwimIcon}>
              <Image source={swimmingPool_icon} ></Image>
            </View>
          </View>
        </View>

        <View style={styles.containerBox2} >
          <Text style={styles.text2}> 15 September 2024</Text>
        </View>

        <View style={styles.containerArea1} >
          <View style={styles.TextArea1}>
            <Text style={styles.Text3}>Time</Text>
          </View >
          <View style={styles.buttonArea1}>
            {/* <Picker 
            selectedValue={timeData}
            onValueChange={(itemVale,itemIndex) =>
              setTime(itemVale)
            }
            >
              <Picker.Item label="10.00-12.00" value={"1"}/>
              <Picker.Item label="12.00-14.00" value={"2"}/>
              <Picker.Item label="14.00-16.00" value={"3"}/>
              <Picker.Item label="16.00-18.00" value={"4"}/>
              <Picker.Item label="18.00-20.00" value={"5"}/>
            </Picker> */}
          </View>

          <View style={styles.TextArea1}>
            <Text style={styles.Text3}>Status</Text>
          </View>
          <View style={styles.buttonArea1}>
            <TouchableOpacity>
              <View style={styles.BoxTime}>
                <Text>Status</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.TextArea1}>
              <Text style={styles.Text3}>StudentID</Text>
            </View>
            <View style={styles.buttonArea1}>
              <TextInput style={styles.BoxTime} ></TextInput>
            </View>
          </View>

          <View>
            <View style={styles.TextArea1}>
              <Text style={styles.Text3}>Name-Surname</Text>
            </View>
          </View>
          <View style={styles.buttonArea1}>
            <TextInput style={styles.BoxTime} ></TextInput>
          </View>

          <View>
            <View style={styles.TextArea1}>
              <Text style={styles.Text3}>Tel.</Text>
            </View>
            <View style={styles.buttonArea1}>
              <TextInput style={styles.BoxTime} ></TextInput>
            </View>
          </View>
        </View>

        <View style={styles.SubmitArea}>
          <TouchableOpacity onPress={payment} style={styles.SubnmitContainer}>
            <View style={styles.SubmitRow}>
              <Icons name="check" size={20} style={styles.checkBox} />
              <Text style={styles.SubmitText}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>



      </View>
    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  contenner_page: {
    flex: 1,
  },
  swimmingPool_bar: {
    width: '105%',
    height: 500,
  },
  barArea: {
    width: '105%',
    height: 10,
  },
  buttonInBox: {
    marginTop: 25,
    marginLeft: 10,
    width: "25%",
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 13,
    color: "black",

  },
  topArea: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  containerBox1: {
    marginTop: 30,
    marginLeft: 15,
    height: "25%",
  },
  text1: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',

  },
  containerSwimIcon: {
    marginTop: -50,
  },
  containerBox2: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '50%',
    height: 35,
    backgroundColor: '#0099FF',
    marginTop: 50,
    borderRadius: 25
  },
  text2: {
    marginTop: 7,
    color: 'white',
    fontWeight: 'bold',
  },
  containerArea1: {
    marginLeft: 50

  },
  BoxTime: {
    width: "95%",
    height: 50,
    backgroundColor: '#EDE9E9',
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  buttonArea1: {
    marginLeft: -30
  },
  TextArea1: {
    marginLeft: -15
  },
  Text3: {
    fontSize: 15,
  },
  SubmitArea: {
    alignItems: 'center',
    marginTop: 20

  },
  SubnmitContainer: {
    width: "40%",
    height: 42,
    backgroundColor: '#0099FF',
    borderRadius: 20,
    alignItems: 'center',
  },
  SubmitText: {
    marginTop: 10,
    color: "#ffff"
  },
  SubmitRow: {
    flexDirection: "row",
  },
  checkBox: {
    color: '#ffff',
    paddingTop: 10,
    paddingRight: 5
  },




})

export default SwimBooking_page