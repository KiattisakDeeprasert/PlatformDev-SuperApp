import { View, Text, SafeAreaView ,Image, StyleSheet, TextInput , } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';



const swimmingPool_bar = require("../img/tapbar_swim.png")
const swimming_icon =require('../img/swimming_icon.png')
const Payment =require('../img/payment.png')



const SwimmingPool_payment = ({navigation} : {navigation :any}) => {
    const backtoHome  = () =>
        navigation.navigate('Home');
    const backtoBooking  = () =>
        navigation.navigate('SwimBooking');
  return ( 
    <SafeAreaView>
      <View>
        <View style={styles.containerswimpool}>
            <Image source={swimmingPool_bar} resizeMode='cover' style={styles.topbar_swimming}  ></Image>
        </View>
        <View>
            <TouchableOpacity onPress={backtoBooking}>
                    <View style={styles.containerBox1}>
                        <Icon name="left" size={20}/>
                            <Text style={styles.text1}>Go back</Text>
                    </View>
            </TouchableOpacity>
        </View>
        <View style={styles.containerBox2}>
            <View>
                <Text style={styles.text2}>Swimming pool</Text>
                <Text style={styles.text2}>Payment</Text>
            </View>
            <View>
                <Image source={swimming_icon} style={styles.swimIcon}></Image>
            </View>
        </View>
        <View style={styles.containerBox3}>
            <Image source={Payment}></Image>
        </View>

        <View style={styles.containerBox4}>
            <Text style={styles.text3}>Lecturer / Staff / Student ID</Text>
        </View>
        <View>
            <TextInput 
            style={styles.textInput1}
            placeholder='ID' ></TextInput>
        </View>
        <View style={styles.containerBox5}>
            <Text style={styles.text4}>Slip payment</Text>
        </View>
        <View style={styles.containerBox6} >
            <View>
                <TouchableOpacity>
                    <View style={styles.containerBox7}>
                        <Text style={styles.text5}>Choose file</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.containerBox8}>
                <Text style={styles.text6}>Note : File Upload ( JPG , JPEG , GIF , TIF , PNG , BMP ) Only!</Text>
            </View>
        </View>
        <View style={styles.containerBox9}>
            <View>
                    <TouchableOpacity onPress={backtoHome}>
                <View style={styles.containerBox10}>
                    <Icon name='check' color={'#F8F8F8'} size={15} style={styles.IconBox} />
                    <Text style={styles.text7}>Submit</Text>
                </View>
                    </TouchableOpacity>
                </View>
        </View>
         
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    topbar_swimming:{
        width:'105%',
        height:500

    },
    containerswimpool:{
        width:'105%',
        height:50,
    },
    containerBox1:{
        marginLeft:20,
        paddingTop:5,
        height:30,
        width:'20%',
        borderRadius:25,
        backgroundColor:'white',
        flexDirection:'row',
        alignContent:'space-between',
        paddingLeft:5,
        marginTop:-20,

    },
    text1:{
        marginRight:5,
        fontSize:13,
        color:"black",
    },
    containerBox2:{
        width:"100%",
        flexDirection:'row',
        alignContent:'space-between',
        alignItems:'center',
        marginLeft:50,
    },
    swimIcon:{
        marginLeft:10,
        marginTop:-40,
        right:10
    },
    text2:{
        color:'white',
        fontWeight:'bold',
        fontSize:24,
        bottom:20
    },
    containerBox3:{
        alignSelf:'center',
        marginTop:50
    },
    containerBox4:{
        marginTop:25,
        marginLeft:20,
    },
    text3:{
        color:'black',
    },
    textInput1:{
        marginLeft:10,
        width:'95%',
        backgroundColor:'#EDE9E9',
        borderRadius:25,
        paddingLeft:10
    },
    containerBox5:{
        marginLeft:20,
        marginTop:20

    },
    text4:{
        color:'black'
    },
    containerBox7:{
        width:"150%",
        height:35,
        marginLeft:20,
        marginTop:10,
        backgroundColor:'#EDE9E9',
        borderRadius:25
    },
    text5:{
        marginTop:10,
        alignSelf:'center',
        fontSize:10
    },
    containerBox6:{
        flexDirection:'row',
        alignContent:'space-around',

    },
    text6:{
        alignSelf:'flex-end',
        marginTop:20,
        color:'red',
        fontSize:9,
        marginRight:20,
        fontWeight:'bold',

    },
    containerBox8:{
        width:"80%"
    },
    containerBox9:{
        width:"100%",
        height:60,
        flexDirection:'row',
        justifyContent:'center',
        marginLeft:-50
    },
    text7:{
        marginLeft:5,
        color:'#F8F8F8',
        alignSelf:'center',
        marginTop:-18,
        fontWeight:'bold'

    },
    containerBox10:{
        width:'200%',
        height:40,
        backgroundColor:'#0099FF',
        marginTop:25,
        borderRadius:20,
        paddingTop:5,
        paddingLeft:5

    },
    IconBox:{
        marginTop:5,
        marginLeft:7
    },







})


export default SwimmingPool_payment