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
    bankTransfer,
    getany,
    getBanks,
    updateBank,
} from '../../../../../utils/apiservice';
import { getFile, sendFile } from '../../../../../utils/apiservice';
import { width, height } from '../../../../../utils/dimensions';
import colors from '../../../../../../colors';
import Buttons from '../../../../../components/Buttons';
import arrowIcon from '../../../../../assets/images/arrow.png';
import Popup from '../../../../../components/Popup';
import { getImageUrl } from '../../../../../utils/FileUtils';
import Loader from '../../../../../components/Loader';
import Constants from '../../../../../utils/constants';
import ImagePickerField from '../../../../../components/ImagePickerField';

type BankProps = {};

interface BankDetail {
    bankAccNo: string;
    bankAccHolderName: string;
    bankNameAndBranch: string;
    bankAccType: string;
    bankIfsc: string;
    checkPhoto: string;
}

interface BankTransferData {
    amount: string;
    bankDetail: BankDetail;
}

const Bank: React.FC<BankProps> = () => {
    const { t } = useTranslation();
    const [select, setSelect] = useState<string | null>(null);
    const [points, setPoints] = useState<string>('');
    const [accNo, setAccNo] = useState<string>('');
    const [accHolder, setAccHolder] = useState<string>('');
    const [accType, setAccType] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [ifscCode, setIfscCode] = useState<string>('');
    const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string>('');
    const [entityUid, setEntityUid] = useState<string>('');
    const [availableBanks, setAvailableBanks] = useState<string[]>([]);
    const [popupContent, setPopupContent] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [loader, showLoader] = useState(true);
    const [fileData, setFileData] = useState({
        uri: "",
        name: "",
        type: ""
    });
    const handleImageClick = () => {
        setShowImagePreviewModal(true);
    };
    useEffect(() => {

        const getBankDetailsAndCallFileUri = async () => {
            try {
                const response = await getany();
                showLoader(false);
                if (response.status === 200) {
                    const data = response.data;
                    setAccHolder(data.bankAccHolderName);
                    setAccType(data.bankAccType);
                    setBankName(data.bankNameAndBranch);
                    setIfscCode(data.bankIfsc);
                    setAccNo(data.bankAccNo);
                    setSelectedImageName(data.checkPhoto);
                    setEntityUid(data.checkPhoto);

                    await getFileUri(data.checkPhoto);
                    if (data.errorMessage) {
                        setPopupContent(data.errorMessage);
                        setPopupVisible(true);
                    }
                } else {
                    setPopupContent('Failed to get bank details');
                    setPopupVisible(true);
                    throw new Error('Failed to get bank details');
                }
            } catch (error) {
                setPopupContent('Failed to get bank details');
                setPopupVisible(true);
                showLoader(false);
                console.error('API Error:', error);
            }
        };

        getBankDetailsAndCallFileUri();

        getBanks()
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    setPopupContent('Failed to get bank names');
                    setPopupVisible(true);
                    showLoader(false);
                    throw new Error('Failed to get bank names');
                }
            })
            .then((responses) => {
                if (Array.isArray(responses)) {
                    const bankNames = responses.map((bank) => bank.bankNameAndBranch);
                    setAvailableBanks(bankNames);
                } else {
                    console.error('Invalid response format');
                }
            })
            .catch((error) => {
                setPopupContent('Failed to get bank names');
                setPopupVisible(true);
                showLoader(false);
                console.error('API Error:', error);
            });
    }, []);

    const getFileUri = async (selectedImageName: string) => {
        try {
            if (selectedImageName != '') {
                const response = getImageUrl(selectedImageName, 'Cheque');
                setSelectedImage(response);
                return response;
            }
        } catch (error) {
            console.error('Error getting file:', error);
            throw error;
        }
    };

    const handleImagePickerPress = () => {
        setShowImagePickerModal(true);
    };

    const handleImageChange = async (image: string, type: string, imageName: string, label: string) => {
        try {
            setFileData({
                uri: image,
                name: imageName,
                type: type
            })
        } catch (error) {
            console.error('Error handling image change in Raise Ticket:', error);
        }
    };

    // const handleCameraUpload = () => {
    //     setShowImagePickerModal(false);
    //     launchCamera(
    //         {
    //             mediaType: 'photo',
    //             includeBase64: false,
    //         },
    //         (response: ImagePickerResponse) => {
    //             if (response.didCancel) {
    //             } else if (response.errorMessage) {
    //                 console.error('Camera error: ', response.errorMessage);
    //             } else {
    //                 const fileData = {
    //                     uri: response.assets[0]?.uri,
    //                     type: response.assets[0].type,
    //                     name: response.assets[0].fileName,
    //                 };
    //                 setSelectedImage(response.assets[0].uri);
    //                 setSelectedImageName(response.assets[0].fileName);
    //                 triggerApiWithImage(fileData);
    //             }
    //         },
    //     );
    // };

    // const handleGalleryUpload = () => {
    //     setShowImagePickerModal(false);
    //     launchImageLibrary(
    //         {
    //             mediaType: 'photo',
    //             includeBase64: false,
    //         },
    //         (response: ImagePickerResponse) => {
    //             if (response.didCancel) {
    //             } else if (response.error) {
    //                 console.error('Image picker error: ', response.error);
    //             } else {
    //                 const fileData = {
    //                     uri: response.assets[0].uri,
    //                     type: response.assets[0].type,
    //                     name: response.assets[0].fileName,
    //                 };
    //                 setSelectedImage(response.assets[0].uri);
    //                 setSelectedImageName(response.assets[0].fileName);
    //                 triggerApiWithImage(fileData);
    //             }
    //         },
    //     );
    // };

    const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }) => {
        const formData = new FormData();
        formData.append('userRole', Constants.RET_USER_TYPE);
        formData.append('imageRelated', 'CHEQUE');
        formData.append('file', {
            uri: fileData.uri,
            name: fileData.name,
            type: fileData.type,
        });

        try {
            const response = await sendFile(formData);
            const image = response.data.entityUid
            setEntityUid(image);
            return response.data.entityUid;
        } catch (error) {
            setPopupContent("Error uploading image");
            setPopupVisible(true)
            console.error('API Error:', error);
        }
    };

    const handleProceed = async () => {
        showLoader(true);
        try {
            await triggerApiWithImage(fileData);
            const postData: BankTransferData = {
                amount: points,
                bankDetail: {
                    bankAccNo: accNo,
                    bankAccHolderName: accHolder,
                    bankAccType: accType,
                    bankNameAndBranch: bankName,
                    bankIfsc: ifscCode,
                    checkPhoto: entityUid
                }
            }
            if (postData.amount != "" &&
                postData.bankDetail.bankAccNo != "" &&
                postData.bankDetail.bankAccHolderName != "" &&
                postData.bankDetail.bankAccType != "" &&
                postData.bankDetail.bankAccType != "" &&
                postData.bankDetail.bankNameAndBranch != "" &&
                postData.bankDetail.bankIfsc != "" &&
                postData.bankDetail.checkPhoto != "") {
                try {
                    const bankTransferResponse = await bankTransfer(postData);
                    showLoader(false);
                    const bankTransferResponseData = bankTransferResponse.data;
                    setPopupVisible(true);
                    setPopupContent(bankTransferResponseData.message);
                } catch (error) {
                    showLoader(false);
                    setPopupVisible(true);
                    setPopupContent('Failed to update Bank Details');
                    console.error('API Error:', error);
                }
            } else {
                showLoader(false);
                setPopupVisible(true);
                setPopupContent("Enter Amount to Proceed!");
            }
        } catch (error) {
            showLoader(false);
            console.error('Error: bt', error);
            setPopupVisible(true);
            setPopupContent("An error occurred");
        }
        // triggerApiWithImage(fileData)
        //     .then((uuid) => {
        //         const postData = {
        //             bankAccNo: accNo,
        //             bankAccHolderName: accHolder,
        //             bankAccType: accType,
        //             bankNameAndBranch: bankName,
        //             bankIfsc: ifscCode,
        //             checkPhoto: entityUid,
        //             points: points
        //         };
        //         if (postData.bankAccNo != "" &&
        //             postData.bankAccHolderName != "" &&
        //             postData.bankAccType != "" &&
        //             postData.bankAccType != "" &&
        //             postData.bankNameAndBranch != "" &&
        //             postData.bankIfsc != "" &&
        //             postData.checkPhoto != "" &&
        //             postData.points != ""
        //         ) {
        //             bankTransfer(postData)
        //                 .then((response) => {
        //                     showLoader(false);
        //                     const responses = response.data;
        //                     return responses;
        //                 })
        //                 .then((data) => {
        //                     setPopupVisible(true);
        //                     setPopupContent(data.message)
        //                 })
        //                 .catch((error) => {
        //                     setPopupContent('Failed to update Bank Details');
        //                     setPopupVisible(true);
        //                     showLoader(false);
        //                     console.error('API Error:', error);
        //                 });
        //         }
        //         else {
        //             showLoader(false);
        //             setPopupContent("Enter all the details");
        //             setPopupVisible(true);
        //         }

        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //         setPopupContent("An error occurred");
        //         setPopupVisible(true);
        //     });

    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Loader isLoading={loader} />
            <View style={styles.mainWrapper}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>
                        {t('strings:bank_details')}
                    </Text>
                    <Text style={styles.textSubHeader}>
                        {t('strings:for_account_tranfer_only')}
                    </Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:enter_points_to_be_redeemed',
                            )}
                            placeholderTextColor={colors.grey}
                            value={points}
                            onChangeText={(value) => setPoints(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:lbl_account_number',
                            )}
                            placeholderTextColor={colors.grey}
                            value={accNo}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:lbl_account_holder_name'
                            )}
                            value={accHolder}
                            placeholderTextColor={colors.grey}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        {/* <Picker
                            selectedValue={accType}
                            onValueChange={(itemValue) => setAccType(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label={t('strings:select_account_type')} value={''} />
                            <Picker.Item label={t('strings:account_type:saving')} value={'Saving'} />
                            <Picker.Item label={t('strings:account_type:current')} value={'Current'} />
                        </Picker> */}
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:select_account_type'
                            )}
                            value={accType}
                            placeholderTextColor={colors.grey}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        {/* <Picker
                            selectedValue={bankName}
                            onValueChange={(itemValue) => setBankName(itemValue)}
                            style={styles.picker}>
                            <Picker.Item
                                key="Select"
                                label="Select Bank Name"
                                value="" />
                            {availableBanks.map((bank, index) => (
                                <Picker.Item
                                    key={index}
                                    label={bank}
                                    value={bank}
                                />
                            ))}
                        </Picker> */}
                        <TextInput
                            style={styles.input}
                            placeholder={t(
                                'strings:bank_name'
                            )}
                            value={bankName}
                            placeholderTextColor={colors.grey}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('strings:ifsc')}
                            value={ifscCode}
                            placeholderTextColor={colors.grey}
                            editable={false}
                        />
                    </View>
                    <View>
                        <ImagePickerField label={t('strings:cancelled_cheque_copy')}
                            onImageChange={handleImageChange}
                            imageRelated='Cheque'
                            initialImage={entityUid}
                            getImageRelated='Cheque'
                            editable={false}
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

export default Bank;
