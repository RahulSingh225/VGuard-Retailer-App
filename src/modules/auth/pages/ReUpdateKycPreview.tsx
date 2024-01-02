import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity, Modal } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getFile, updateKycReatiler } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import Popup from '../../../components/Popup';
import Loader from '../../../components/Loader';
interface ReUpdateKycPreviewProps {
    navigation: any;
}
const ReUpdateKycPreview: React.FC<ReUpdateKycPreviewProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<UserData | any>();
    const [postData, setPostData] = useState<UserData | any>();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [gstImageName, setGstImageName] = useState("");
    const [idFrontImageName, setIdFrontImageName] = useState("");
    const [idBackImageName, setIdBackImageName] = useState("");
    const [panImageName, setPanImageName] = useState("");
    const [imageOpen, setimageOpen] = useState("");
    const [loader, showLoader] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('VGUSER').then(result => {
            setUserData(JSON.parse(result))
            console.log("<><><><", result);
            setPostData(JSON.parse(result))
            showLoader(false);
        })
    }, []);

    const handleImageClick = (imageSource: string | "") => {
        setShowImagePreviewModal(true);
        setimageOpen(imageSource);
    };

    const handleSubmit = async () => {
        console.log("Post Data:----", postData);
        updateKycReatiler(postData)
            .then(response => response.json())
            .then((responseData) => {
                console.log("RESPONSE DATA:", responseData)
                setPopupVisible(true);
                setPopupContent(responseData?.message);
                // AsyncStorage.removeItem('VGUSER');
            })
            .catch(error => {
                console.error('Error posting data:', error);
            });
    }
    const handleEdit = async () => {
        navigation.navigate('ReUpdateKyc', { usernumber: postData.contactNo });
    }
    const [gstCopySource, setGstCopySource] = useState<string | null>(null);
    const [idFrontCopySource, setIdFrontCopySource] = useState<string | null>(null);
    const [idBackCopySource, setIdBackCopySource] = useState<string | null>(null);
    const [panCopySource, setPanCopySource] = useState<string | null>(null);

    useEffect(() => {
        const fetchChequeCopy = async () => {
            try {
                const gstSource = await renderField("GST Photo");
                setGstCopySource(gstSource);
                const idFrontSource = await renderField("Id Proof* (Front)");
                setIdFrontCopySource(idFrontSource);
                const idBackSource = await renderField("Id Proof* (Back)");
                setIdBackCopySource(idBackSource);
                const panSource = await renderField("Pan Card (Front)");
                setPanCopySource(panSource);
            } catch (error) {
                console.error("Error fetching photo:", error);
            }
        };

        const fetchImageNames = () => {
            setGstImageName(userData?.kycDetails?.gstFront || "");
            setIdFrontImageName(userData?.kycDetails?.aadharOrVoterOrDlFront || "");
            setIdBackImageName(userData?.kycDetails?.aadharOrVoterOrDlBack || "");
            setPanImageName(userData?.kycDetails?.panCardFront || "");
        };

        fetchChequeCopy();
        fetchImageNames();
    }, [
        userData?.kycDetails?.aadharOrVoterOrDlFront, 
        userData?.kycDetails?.aadharOrVoterOrDlBack, 
        userData?.kycDetails?.panCardFront]);

    const renderField = async (fieldName: string): string => {
        if (fieldName === 'GST Photo') {
            const gstFront = userData.kycDetails.gstFront;
            setGstImageName(gstFront)
            const gstPhoto = await getFile(gstFront, 'GST', "2");
            const url = gstPhoto.url
            console.log("URL", url)
            return url;
        }
        else if (fieldName === "Id Proof* (Front)") {
            const idfront = userData.kycDetails.aadharOrVoterOrDLFront;
            console.log("FRONT SOURCE-----------", idfront)
            setIdFrontImageName(idfront)
            const idFrontPhoto = await getFile(idfront, 'ID_CARD_FRONT', "2");
            const url = idFrontPhoto.url
            console.log("URL", url)
            return url;
        }
        else if (fieldName === "Id Proof* (Back)") {
            const idback = userData.kycDetails.aadharOrVoterOrDlBack;
            setIdBackImageName(idback)
            const idBackPhoto = await getFile(idback, 'ID_CARD_BACK', "2");
            const url = idBackPhoto.url
            return url;
        }
        else if (fieldName === "Pan Card (Front)") {
            const panFront = userData.kycDetails.panCardFront;
            setPanImageName(panFront)
            const panPhoto = await getFile(panFront, 'PAN_CARD_FRONT', "2");
            const url = panPhoto.url
            return url;
        }
    };

    return (
        <ScrollView style={styles.mainWrapper}>
            {loader && <Loader isLoading={loader} />}
            <View style={styles.detailsContainer}>
                <InputField
                    label={t('strings:retailer_name')}
                    value={postData?.name}
                    disabled={true}
                />
                <InputField
                    label={t('strings:contact_number')}
                    value={userData?.contactNo}
                    disabled={true}
                />
                <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
                <InputField
                    label={t('strings:lbl_permanent_address_mandatory')}
                    value={postData?.permanentAddress}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_street_locality')}
                    value={postData?.streetAndLocality}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_landmark')}
                    value={postData?.landmark}
                    disabled={true}
                />
                <InputField
                    label={t('strings:pincode')}
                    value={postData?.pinCode}
                    disabled={true}
                />
                <InputField
                    label={t('strings:lbl_state')}
                    value={postData?.state}
                    disabled={true}
                />
                <InputField
                    label={t('strings:district')}
                    value={postData?.dist}
                    disabled={true}
                />
                <InputField
                    label={t('strings:city')}
                    value={postData?.city}
                    disabled={true}
                />
                <InputField
                    label="Id Proof* (Front)"
                    isImage
                    imageName={idFrontImageName}
                    imageSource={idFrontCopySource}
                    onPressImage={() => handleImageClick(idFrontCopySource)}
                />
                <InputField
                    label='Id Proof* (Back)'
                    isImage
                    imageName={idBackImageName}
                    imageSource={idBackCopySource}
                    onPressImage={() => handleImageClick(idBackCopySource)}
                />
                <InputField
                    label={t('strings:id_proof_no')}
                    value={postData?.kycDetails?.aadharOrVoterOrDlNo}
                    disabled={true}
                />
                <InputField
                    label='Pan Card (Front)*'
                    isImage
                    imageName={panImageName}
                    imageSource={panCopySource}
                    onPressImage={() => handleImageClick(panCopySource)}
                />
                <InputField
                    label={t('strings:update_pan_number_manually')}
                    value={postData?.kycDetails?.panCardNo}
                    disabled={true}
                />
                <InputField
                    label={t('strings:do_you_have_gst_number')}
                    value={postData?.kycDetails?.gstYesNo}
                    disabled={true}
                />
                <InputField
                    label={t('strings:gst_no')}
                    value={postData?.kycDetails?.gstNo}
                    disabled={true}
                />
                <InputField
                    label="GST Photo"
                    isImage
                    imageName={gstImageName}
                    imageSource={gstCopySource}
                    onPressImage={() => handleImageClick(gstCopySource)}
                />

                <View style={styles.buttons}>
                    <View style={styles.button}>
                        <Buttons
                            label={t('strings:Edit')}
                            variant="blackButton"
                            onPress={() => handleEdit()}
                            width="100%"
                        />
                    </View>
                    <View style={styles.button}>
                        <Buttons
                            label={t('strings:submit')}
                            variant="filled"
                            onPress={() => handleSubmit()}
                            width="100%"
                        />
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showImagePreviewModal}
                onRequestClose={() => setShowImagePreviewModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={() => setShowImagePreviewModal(false)}
                    >
                        <Image resizeMode='contain' style={{ width: 50, height: 50 }} source={require('../../../assets/images/ic_close.png')} />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: imageOpen }}
                        style={{ width: '70%', height: '70%' }}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
            {isPopupVisible && (
                <Popup isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                    {popupContent}
                </Popup>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    mainWrapper: {
        padding: 15,
        flex: 1,
        backgroundColor: colors.white,
    },
    ImageProfile: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    textName: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(3),
        marginTop: responsiveHeight(2),
    },
    label: {
        color: colors.grey,
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(3),
        fontWeight: 'bold'
    },
    textDetail: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold'
    },
    viewProfile: {
        color: colors.yellow,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(1.7),
    },
    data: {
        color: colors.black,
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(3),
        textAlign: 'right',
        fontWeight: 'bold'
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    detailsContainer: {
        flexDirection: 'column',
        marginVertical: 30
    },
    subHeading: {
        color: colors.grey,
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        marginBottom: 30,
        flex: 1
    },
    container: {
        height: 50,
        marginBottom: 20,
        borderColor: colors.lightGrey,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    focusedContainer: {
        borderColor: colors.grey,
    },
    label: {
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: colors.white,
        paddingHorizontal: 3,
    },
    focusedLabel: {
        position: 'absolute',
        top: -8,
        left: 10,
        fontSize: responsiveFontSize(1.5),
        color: colors.black,
    },
    input: {
        color: colors.black,
        paddingTop: 10,
    },
    disabledInput: {
        color: colors.grey,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    }
});

export default ReUpdateKycPreview;
