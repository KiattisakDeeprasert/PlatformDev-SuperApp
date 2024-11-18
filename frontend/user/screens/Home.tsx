import { View, Text, StyleSheet, Image, Pressable, } from 'react-native'
import React from 'react'



const backgrounImg = require('../img/Background.png')
const swimmingPool = require("../img/Swimming_contener.png")
const Badminton = require("../img/Badminton_contener.png")
const Football = require("../img/Football_contener.png")
const Fitnet = require("../img/Fitnet_contener.png")

const Home = ({ navigation }: { navigation: any }) => {
  const swimTime = () => {
    navigation.navigate('SwimTime')
  }

  return (
    <View>
      <View style={styles.background}>
        <Image source={backgrounImg} style={{ width: "100%", height: 400 }}></Image>
      </View>

      <View >
        <Text style={styles.Textcolor1}>MFU Sport</Text>
        <Text style={styles.Textcolor2}>Complex</Text>
      </View>
      <View style={styles.containerIcon} >
        <Pressable onPress={swimTime}>
          <Image source={swimmingPool} ></Image>
        </Pressable>
        <Image source={Badminton} ></Image>
        <Image source={Football}></Image>
        <Image source={Fitnet} ></Image>
      </View>
      <View >
        <Text style={styles.bar_contener}></Text>
      </View>
      <View >
        <Text style={styles.bar2_contener}></Text>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: 20
  },
  Textcolor1: {
    top: 30,
    fontSize: 30,
    left: 20,
    color: "white",
    fontWeight: "bold",
  },
  Textcolor2: {
    top: 25,
    left: 20,
    fontSize: 23,
    color: "white",
    fontWeight: "bold",
  },
  containerIcon: {
    marginTop: 150,
    alignItems: 'center',

  },
  bar_contener: {
    top: 300,
    alignSelf: "center",
    height: 150,
    width: 450,
    backgroundColor: "#E6EAEE",
    borderRadius: 90 / 2,
  },
  bar2_contener: {
    top: 170,
    height: 150,
    width: 450,
    alignSelf: "center",
    backgroundColor: "#F5F6F7",
  }


}
)

export default Home