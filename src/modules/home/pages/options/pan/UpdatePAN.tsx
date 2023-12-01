import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
    responsiveFontSize,
    responsiveHeight,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    updateKycReatiler
} from '../../../../../utils/apiservice';
import { getFile, sendFile } from '../../../../../utils/apiservice';
import { width, height } from '../../../../../utils/dimensions';
import colors from '../../../../../../colors';
import Buttons from '../../../../../components/Buttons';
import arrowIcon from '../../../../../assets/images/arrow.png';
import Popup from '../../../../../components/Popup';
import NeedHelp from '../../../../../components/NeedHelp';

type BankProps = {};

const UpdatePAN: React.FC<BankProps> = () => {
    const { t } = useTranslation();
    const [select, setSelect] = useState<string | null>(null);
    const [panNumber, setPanNumber] = useState<string>('');
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string>('');
    const [entityUid, setEntityUid] = useState<string>('');
    const [popupContent, setPopupContent] = useState('');
    const [userId, setUserId] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userString = await AsyncStorage.getItem('USER');
                if (userString) {
                    const user = JSON.parse(userString);
                    const shapedUser = {
                        userId: user?.contactNo || ''
                    };
                    setUserId(shapedUser.userId);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleImagePickerPress = () => {
        setShowImagePickerModal(true);
    };

    const handleCameraUpload = () => {
        setShowImagePickerModal(false);
        launchCamera(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    console.log('Camera was canceled');
                } else if (response.error) {
                    console.error('Camera error: ', response.error);
                } else {
                    const fileData = {
                        uri: response.assets[0].uri,
                        type: response.assets[0].type,
                        name: response.assets[0].fileName,
                    };
                    setSelectedImage(response.assets[0].uri);
                    setSelectedImageName(response.assets[0].fileName);
                    triggerApiWithImage(fileData);
                }
            },
        );
    };

    const handleGalleryUpload = () => {
        setShowImagePickerModal(false);
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
            },
            (response: ImagePickerResponse) => {
                if (response.didCancel) {
                    console.log('Image picker was canceled');
                } else if (response.error) {
                    console.error('Image picker error: ', response.error);
                } else {
                    const fileData = {
                        uri: response.assets[0].uri,
                        type: response.assets[0].type,
                        name: response.assets[0].fileName,
                    };
                    setSelectedImage(response.assets[0].uri);
                    setSelectedImageName(response.assets[0].fileName);
                    triggerApiWithImage(fileData);
                }
            },
        );
    };

    const triggerApiWithImage = async (fileData: FormData) => {
        const formData = new FormData();
        formData.append('USER_ROLE', 2);
        formData.append('image_related', 'PAN_CARD_FRONT');
        formData.append('file', fileData);

        try {
            const response = await sendFile(formData);
            setEntityUid(response.data.entityUid);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const handleProceed = async () => {
        const postData = {
            panCardNo: panNumber,
            panCardFront: entityUid,
            userId: userId,
        };

        try {
            const response = await updateKycReatiler(postData);
            console.log(postData, '---------------postdata');

            if (response.status === 200) {
                const responseData = await response.json();
                showSnackbar(responseData.message);
            } else {
                throw new Error('Failed to update PAN');
            }
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const showSnackbar = (message: string) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainWrapper}>
                <View style={styles.form}>
                    <View>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={handleImagePickerPress}>
                            {selectedImage ? (
                                <TextInput
                                    style={styles.input}
                                    placeholder={selectedImageName}
                                    placeholderTextColor={colors.grey}
                                    editable={false}
                                />
                            ) : (
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('strings:update_pan_card_front')}
                                    placeholderTextColor={colors.grey}
                                    editable={false}
                                />
                            )}
                            <View style={styles.inputImage}>
                                {selectedImage ? (
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Image
                                        source={require('../../../../../assets/images/photo_camera.png')}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Modal for selecting camera or gallery */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showImagePickerModal}
                            style={styles.modalcontainer}
                            hardwareAccelerated={true}
                            opacity={0.3}>
                            <View style={{
                                width: width / 1.80, borderRadius: 5, alignSelf: 'center', height: height / 8, top: height / 2.8,
                                margin: 20,
                                backgroundColor: '#D3D3D3',
                                borderRadius: 20,
                                padding: 10,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 100,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Picker
                                    mode="dropdown"
                                    style={{ color: 'black' }}
                                    selectedValue={select}
                                    onValueChange={(itemValue, itemIndex) => {
                                        if (itemValue === "Open camera") {
                                            handleCameraUpload()
                                        } else if (itemValue === "Open Image picker") {
                                            handleGalleryUpload();
                                        }
                                    }}
                                >
                                    <Picker.Item label="Select Action" value="" />
                                    <Picker.Item label="Select Photo from gallery" value="Open Image picker" />
                                    <Picker.Item label="Capture Photo from camera" value="Open camera" />

                                </Picker>
                                <Button mode="text" onPress={() => setShowImagePickerModal(false)}>
                                    Close
                                </Button>
                            </View>
                        </Modal>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('strings:update_pan_number_manually')}
                            value={panNumber}
                            placeholderTextColor={colors.grey}
                            onChangeText={(value) => setPanNumber(value)}
                        />
                    </View>

                </View>
                <View style={styles.button}>
                    <Buttons
                        label={t('strings:submit')}
                        variant="filled"
                        onPress={() => handleProceed()}
                        width="100%"
                        iconHeight={10}
                        iconWidth={30}
                        iconGap={30}
                        icon={arrowIcon}
                    />
                </View>
                <NeedHelp />
            </View>
            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                    {popupContent}
                </Popup>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    mainWrapper: {
        padding: 15,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    inputImage: {
        height: responsiveHeight(2),
        width: responsiveHeight(2),
        marginRight: 5,
    },
    textHeader: {
        fontSize: responsiveFontSize(2.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    textSubHeader: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        fontWeight: 'bold',
    },
    container: {
        height: responsiveHeight(8),
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    buttonText: {
        color: colors.white,
        width: '100%',
        textAlign: 'center',
    },
    inputContainer: {
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 10,
        height: responsiveHeight(5),
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1),
    },
    input: {
        width: '90%',
        padding: 10,
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        // fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        alignItems: 'center',
    },
    picker: {
        width: '90%',
        color: colors.grey,
    },
    labelPicker: {
        color: colors.grey,
        fontWeight: 'bold',
    },
    modalcontainer: { alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },

});

export default UpdatePAN;
