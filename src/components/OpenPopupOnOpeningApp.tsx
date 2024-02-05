import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking, Image, View, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const OpenPopupOnOpeningApp = () => {
    const [isModalVisible, setModalVisible] = useState(true);
    const [userData, setUserData] = useState({
        videoPath: "",
        imgPath: "",
        vdoText: "",
        textMessage: "",
    });
    const [imageHeight, setImageHeight] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('USER').then(r => {
            const value = JSON.parse(r);
            const welcomeBanner = value?.welcomeBanner || {};
            setUserData({
                videoPath: welcomeBanner.videoPath || "",
                imgPath: welcomeBanner.imgPath || "",
                vdoText: welcomeBanner.vdoText || "",
                textMessage: welcomeBanner.textMessage || "Welcome!",
            });

            Image.getSize(imageUrl, (width, height) => {
                let value = height;
                if(value > 500){
                    value = value/2;
                    if(value > 500){
                        value = value/2;
                    }
                }
                setImageHeight(value);
            }, error => console.error("Error getting image size:", error));
        });
    }, []);

    const handlePress = () => {
        Linking.openURL(userData.videoPath);
    };

    const imageUrl = "https://www.vguardrishta.com/" + userData.imgPath;

    return (
        <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={[styles.modalContainer]}>
                <View style={[styles.modalContent, { height: imageHeight }]}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.viewTouchable} onPress={handlePress}>
                        <Text style={styles.viewText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Image
                            source={require('../assets/images/ic_close.png')}
                            style={styles.closeButtonImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        marginBottom: 30,
        marginTop: 0,
    },
    closeButton: {
        height: 50,
        width: 50,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    closeButtonImage: {
        height: '100%',
        width: '100%',
    },
    viewText: {
        color: colors.black,
        fontWeight: 'bold',
    },
    viewTouchable: {
        backgroundColor: colors.yellow,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        position: 'absolute',
        bottom: 0,
        marginBottom: 5,
    },
});

export default OpenPopupOnOpeningApp;
