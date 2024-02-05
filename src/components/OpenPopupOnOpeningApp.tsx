import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking, Image, View, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const OpenPopupOnOpeningApp = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [userData, setUserData] = useState({
        videoPath: "",
        imgPath: "",
        vdoText: "",
        textMessage: "",
    });
    const [imageHeight, setImageHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(0);

    useEffect(() => {
        getDetails();
    }, []);
    useEffect(() => {
        getImageSize()
            .then(({ width, height }) => {
                setImageWidth(width);
                setImageHeight(height);
            })
            .catch(error => {
                console.error("Error:", error.message);
            });

        if (userData.imgPath != "") {
            setModalVisible(true);
        }
    }, [userData.imgPath]);

    const getDetails = async () => {
        await AsyncStorage.getItem('USER').then(r => {
            const value = JSON.parse(r);
            const welcomeBanner = value?.welcomeBanner || {};
            setUserData({
                videoPath: welcomeBanner.videoPath || "",
                imgPath: welcomeBanner.imgPath || "",
                vdoText: welcomeBanner.vdoText || "",
                textMessage: welcomeBanner.textMessage || "Welcome!",
            });
        });
    }

    const getImageSize = async () => {
        return new Promise((resolve, reject) => {
            Image.getSize(imageUrl, (width, height) => {
                let optimizedHeight = height;
                let optimizedWidth = width;
    
                const screenHeight = Dimensions.get('window').height;
                const screenWidth = Dimensions.get('window').width;
                const maxHeight = 0.8 * screenHeight;
                const maxWidth = 0.8 * screenWidth;
    
                while (optimizedHeight > maxHeight || optimizedWidth > maxWidth) {
                    optimizedHeight /= 1.5;
                    optimizedWidth /= 1.5;
                }
    
                resolve({ width: optimizedWidth, height: optimizedHeight + 50 });
            }, error => reject(new Error("Error getting image size:" + error)));
        });
    };


    const handlePress = () => {
        Linking.openURL(userData.videoPath);
    };

    const imageUrl = "https://www.vguardrishta.com/" + userData.imgPath;
    // const imageUrl = "https://source.unsplash.com/low-angle-photography-of-steel-trusses-N9UuFddi7hs";

    return (
        <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={[styles.modalContainer]}>
                <View style={[styles.modalContent, { height: imageHeight, width: imageWidth }]}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={styles.buttonContainer}>
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
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    image: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start'
    },
    closeButton: {
        height: 50,
        width: 50,
        position: 'absolute',
        right: 0
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
        height: 40
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 5.4
    }
});

export default OpenPopupOnOpeningApp;
