import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    responsiveFontSize,
    responsiveHeight,
} from 'react-native-responsive-dimensions';
import { useTranslation } from 'react-i18next';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    updateKycReatiler
} from '../../../../../utils/apiservice';
import colors from '../../../../../../colors';
import Buttons from '../../../../../components/Buttons';
import arrowIcon from '../../../../../assets/images/arrow.png';
import Popup from '../../../../../components/Popup';
import NeedHelp from '../../../../../components/NeedHelp';
import ImagePickerField from '../../../../../components/ImagePickerField';
import InputField from '../../../../../components/InputField';

type BankProps = {};

const UpdatePAN: React.FC<BankProps> = () => {
    const { t } = useTranslation();
    const [panNumber, setPanNumber] = useState<string>('');
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
                        userId: user?.contactNo || '',
                        entityUid: user?.kycDetails?.panCardFront,
                        panNumber: user?.kycDetails?.panCardNo
                    };
                    setUserId(shapedUser.userId);
                    setPanNumber(shapedUser.panNumber);
                    setEntityUid(shapedUser.entityUid);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

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

    const handleImageChange = async (image: string, imageName: string, apiResponse: any, label: string) => {
        try {
            setEntityUid(apiResponse.data.entityUid)
            console.log('API Response in Update Pan:', apiResponse);
        } catch (error) {
            console.error('Error handling image change in EditProfile:', error);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainWrapper}>
                <View style={styles.form}>
                        <ImagePickerField label='Pan Card* (Front)'
                            onImageChange={handleImageChange}
                            imageRelated='PAN_CARD_FRONT'
                            initialImage={entityUid}
                        />
                        <InputField
                            label={t('strings:update_pan_number_manually')}
                            value={panNumber}
                            onChangeText={(value) => setPanNumber(value)}
                        />

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
    imagePreviewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    imagePreview: {
        width: '80%',
        height: '80%',
    },


});

export default UpdatePAN;
