import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import colors from '../../colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { sendFile } from '../utils/apiservice';

const { width, height } = Dimensions.get('window');

interface ImagePickerFieldProps {
    label: string;
    onImageChange: (image: string, imageName: string, apiResponse: any, label: string) => void;
    setImageData: () => void;
    imageRelated: string;
  }
  

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({ label, onImageChange, imageRelated }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
    const [showImagePickerModal, setShowImagePickerModal] = useState(false);
    const [select, setSelect] = useState('');
    const [isImageSelected, setIsImageSelected] = useState(false); // New state
    const [entityUid, setEntityUid] = useState<string>('');

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
                handleImageResponse(response);
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
                handleImageResponse(response);
            },
        );
    };

    const handleImageResponse = async (response: ImagePickerResponse) => {
        console.log('Response:', response);
        const fileData = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        };
    
        if (response.didCancel) {
          console.log('Image picker was canceled');
        } else if (response.error) {
          console.error('Image picker error: ', response.error);
        } else {
          setSelectedImage(response?.assets[0]?.uri);
          setSelectedImageName(response?.assets[0]?.fileName || 'Image');
          setIsImageSelected(true);
    
          try {
            const apiResponse = await triggerApiWithImage(fileData);
            console.log('API Response in ImagePickerField:', apiResponse);
            
            onImageChange(response?.assets[0]?.uri, response?.assets[0]?.fileName || 'Image', apiResponse, label);
          } catch (error) {
            console.error('Error triggering API with image in ImagePickerField:', error);
          }
        }
      };

    const triggerApiWithImage = async (fileData: FormData) => {
        const formData = new FormData();
        formData.append('USER_ROLE', 2);
        formData.append('image_related', imageRelated);
        formData.append('file', fileData);

        try {
            const response = await sendFile(formData);
            setEntityUid(response.data.entityUid);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.input, isImageSelected && styles.selectedContainer]} onPress={handleImagePickerPress}>
                <View style={[styles.labelContainer, !selectedImage && styles.notSelectedLabelContainer]}>
                    <Text style={[isImageSelected && styles.focusedLabel]} >
                        {label}
                    </Text>
                </View>
                {selectedImage ? (
                    <View style={styles.imageContainer}>
                        <Text style={styles.imageName}>
                            {selectedImageName}
                        </Text>
                        <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
                    </View>
                ) : (
                    <View style={styles.cameraContainer}>
                        <Text style={styles.label}>
                            {label}
                        </Text>
                        <Image
                            source={require('../assets/images/photo_camera.png')}
                            style={styles.cameraImage}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showImagePickerModal}
                style={styles.modalcontainer}
                hardwareAccelerated={true}
                opacity={0.3}
            >
                <View style={styles.modalContent}>
                    <Picker
                        mode="dropdown"
                        style={{ color: 'black' }}
                        selectedValue={select}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemValue === 'Open camera') {
                                handleCameraUpload();
                            } else if (itemValue === 'Open Image picker') {
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
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: colors.lightGrey,
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        top: 0,
        left: 10,
        right: 0,
        justifyContent: 'center',
        zIndex: 1,
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: colors.black,
        width: '92%',
    },
    focusedLabel: {
        position: 'absolute',
        top: -10,
        left: 0,
        fontSize: responsiveFontSize(1.5),
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    cameraContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraImage: {
        width: 25,
        height: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative', // Ensure the relative position for the focused label
    },
    image: {
        width: 25,
        height: 20,
        marginRight: 10,
    },
    modalContent: {
        width: width / 1.8,
        borderRadius: 5,
        alignSelf: 'center',
        height: height / 8,
        top: height / 2.8,
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
    },
    imageName: {
        color: colors.black,
        fontSize: responsiveFontSize(1.5),
        width: '92%'
    },
    selectedContainer: {
        borderColor: colors.grey,
    },
});

export default ImagePickerField;
