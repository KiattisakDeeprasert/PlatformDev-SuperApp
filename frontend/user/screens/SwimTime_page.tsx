import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
//
const swimmingPool_bar = require("../img/tapbar_swim.png");
const swimmingPool_icon = require("../img/swimming_icon.png");

const SwimTime_page = ({ navigation } :{navigation : any}) => {
    const [timeList] = useState([
        { id: '1', time: '10:00 - 12:00' },
        { id: '2', time: '12:00 - 14:00' },
        { id: '3', time: '14:00 - 16:00' },
        { id: '4', time: '16:00 - 18:00' },
        { id: '5', time: '18:00 - 20:00' }
    ]);

    const [selectedId, setSelectedId] = useState(null);

    const handlePress = (id :any, time :any) => {
        setSelectedId(id); // Set the selected item ID
        navigation.navigate('SwimBooking', { selectedTime: time }); // Pass selected time to SwimBooking
    };

    const back = () => navigation.navigate("Home");

    return (
        <SafeAreaView style={styles.container_page}>
            <View>
                <View style={styles.barArea}>
                    <Image source={swimmingPool_bar} resizeMode='cover' style={styles.swimmingPool_bar} />
                </View>
                <TouchableOpacity onPress={back}>
                    <View style={styles.buttonInBox}>
                        <Icon name="left" size={20} />
                        <Text style={styles.buttonText}>Go back</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.topArea}>
                    <View style={styles.containerBox1}>
                        <Text style={styles.text1}>Swimming Pool</Text>
                        <Text style={styles.text1}>Booking</Text>
                    </View>
                    <View style={styles.containerSwimIcon}>
                        <Image source={swimmingPool_icon} />
                    </View>
                </View>
                <View style={styles.containerBox2}>
                    <Text style={styles.text2}>15 September 2024</Text>
                </View>

                <FlatList
                    numColumns={2}
                    data={timeList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.containerTime}>
                            <TouchableOpacity onPress={() => handlePress(item.id, item.time)}>
                                <View style={[
                                    styles.timeSlot,
                                    { backgroundColor: item.id === selectedId ? '#E6ACAC' : '#E9F6EA' }
                                ]}>
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container_page: {
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
    buttonText: {
        marginLeft: 10,
        fontSize: 13,
        color: "black",
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
    topArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        borderRadius: 25,
    },
    text2: {
        marginTop: 7,
        color: 'white',
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 15,
        alignSelf: 'center',
        marginTop: 10,
    },
    timeSlot: {
        height: 50,
        width: '180%',
        marginTop: 20,
        borderRadius: 30,
        alignItems: 'center',
    },
    containerTime: {
        marginLeft: 40,
        marginRight: 50,
    }
});

export default SwimTime_page;
