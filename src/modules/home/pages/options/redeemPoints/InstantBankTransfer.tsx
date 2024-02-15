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
import InputField from '../../../../../components/InputField';
import PickerField from '../../../../../components/PickerField';

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
    const [points, setPoints] = useState<string>('');
    const [accNo, setAccNo] = useState<string>('');
    const [accHolder, setAccHolder] = useState<string>('');
    const [accType, setAccType] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [ifscCode, setIfscCode] = useState<string>('');
    const [entityUid, setEntityUid] = useState<string>('');
    const [popupContent, setPopupContent] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [loader, showLoader] = useState(true);

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
                setEntityUid(data.checkPhoto);
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
    useEffect(() => {
        getBankDetailsAndCallFileUri();
    }, []);

    const handleProceed = async () => {
        showLoader(true);
        try {
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
                    <InputField
                        label={t('strings:enter_points_to_be_redeemed')}
                        value={points}
                        onChangeText={(value) => setPoints(value)}
                        />
                    <InputField
                        label={t('strings:lbl_account_number')}
                        value={accNo}
                        disabled={true}  />
                    <InputField
                        label={t('strings:lbl_account_holder_name')}
                        value={accHolder}
                        disabled={true}  />
                     <InputField
                        label={t('Select Bank Name')}
                        value={bankName}
                        disabled={true}  />
                    <InputField
                        label={t('strings:ifsc')}
                        value={ifscCode}
                        disabled={true}  />

                    <ImagePickerField label={t('strings:cancelled_cheque_copy')}
                        imageRelated='Cheque'
                        initialImage={entityUid}
                        getImageRelated='Cheque'
                        editable={false}
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
