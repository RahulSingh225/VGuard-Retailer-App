import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import colors from '../../../../colors';
import { getCities, getDistricts, getRishtaUserProfile, getStates, sendFile } from '../../../utils/apiservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { UserData } from '../../../utils/modules/UserData';
import InputField from '../../../components/InputField';
import Buttons from '../../../components/Buttons';
import PickerField from '../../../components/PickerField';
import Popup from '../../../components/Popup';
import ImagePickerField from '../../../components/ImagePickerField';
import Loader from '../../../components/Loader';
interface ReUpdateKycProps {
    navigation: any;
    route: {
        params: {
            usernumber: string;
        };
    };
}

const ReUpdateKyc: React.FC<ReUpdateKycProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { usernumber } = route.params;
    const [postData, setPostData] = useState<UserData | any>();
    const [isShopAddressDifferent, setIsShopAddressDifferent] = useState('Yes');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
        setPostData((prevData: UserData) => ({
            ...prevData,
            contactNo: usernumber
        }));
    }, []);

    useEffect(() => {
        getRishtaUserProfile()
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(res => {
                const result = res;
                setPostData(result);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, [usernumber]);

    // const fetchState = async () => {
    //     try {
    //         const statesResponse = await getStates();
    //         const statesData = await statesResponse.data;
    //         setStates(statesData);
    //     }
    //     catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

    const fetchData = async () => {
        try {
            const statesResponse = await getStates();
            const statesData = await statesResponse.data;
            setStates(statesData);

            const defaultState = postData.stateId;

            const districtsResponse = await getDistricts(defaultState);
            const districtsData = await districtsResponse.data;

            if (Array.isArray(districtsData)) {
                setDistricts(districtsData);

                if (Array.isArray(districtsData) && districtsData.length > 0) {
                    const citiesResponse = await getCities(postData.distId);
                    const citiesData = await citiesResponse.data;
                    console.log("CITIES-----------", citiesData);
                    setCities(citiesData);
                }
            } else {
                console.error('Error: Districts data is not an array.', districtsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const validateField = (label: string, value: string, postData: UserData | any) => {
        const errors: string[] = [];

        switch (label) {
            case 'name':
                if (!value || value.match(/\d/)) {
                    errors.push('Name should not contain numbers');
                }
                if (value == "") {
                    errors.push('Name should not be empty');
                }
                break;
            case 'permanentAddress':
                if (value == "") {
                    errors.push('Address should not be empty');
                }
            case 'streetAndLocality':
                if (value == "") {
                    errors.push('Street and Locality should not be empty');
                }
            case 'pinCode':
                if (value == "") {
                    errors.push('Pincode should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDLFront':
                if (value == "") {
                    errors.push('Aadhar Card Front should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDlBack':
                if (value == "") {
                    errors.push('Aadhar Card Back should not be empty');
                }
            case 'kycDetails.panCardFront':
                if (value == "") {
                    errors.push('Pan Card Front should not be empty');
                }
            case 'kycDetails.panCardNo':
                if (value == "") {
                    errors.push('Pan Number should not be empty');
                }
            case 'kycDetails.aadharOrVoterOrDlNo':
                if (value == "") {
                    errors.push('Aadhaar Number should not be empty');
                }
            case 'kycDetails.gstNo':
                if (postData?.kycDetails?.gstYesNo == "Yes" && value == "") {
                    errors.push('GST No. should not be empty');
                }
            default:
                break;
        }
        return errors;
    };

    const triggerApiWithImage = async (fileData: { uri: string; type: string; name: string }, imageRelated: string) => {
        try {
          const formData = new FormData();
          formData.append('USER_ROLE', '2');
          formData.append('image_related', imageRelated);
          formData.append('file', {
            uri: fileData.uri,
            name: fileData.name,
            type: fileData.type,
          });
    
          console.log("formData=====", formData);
          const response = await sendFile(formData);
          console.log("response-----------", response.data.entityUid);
          return response.data.entityUid;
        } catch (error) {
          setPopupContent("Error uploading image");
          setPopupVisible(true);
          console.error('API Error:', error);
          throw error;
        }
      };


    const InitiatePreview = async () => {
        try {
            const errors: string[] = validateField('name', postData?.name, postData);

            setValidationErrors(errors);

            if (errors.length === 0) {
                const panImage = panFileData;
                const idFront = idFrontFileData;
                const idBack = idBackFileData;
                const gst = GstFileData;
                console.log(panImage);
                
                if (idFront.uri != "") {
                    console.log("idFRONTE")
                    const idFrontUid = await triggerApiWithImage(idFront, 'ID_CARD_FRONT');
                    setPostDataOfImage('aadharOrVoterOrDLFront', idFrontUid);
                }
                if (idBack.uri != "") {
                    console.log("idBack")
                    const idBackUid = await triggerApiWithImage(idBackFileData, 'ID_CARD_BACK');
                    setPostDataOfImage('aadharOrVoterOrDlBack', idBackUid);
                }
                if (gst.uri != "") {
                    console.log("GSTS<><><><>")
                    const gstUid = await triggerApiWithImage(GstFileData, 'GST');
                    setPostDataOfImage('gstFront', gstUid);
                }
                if (panImage.uri != "") {
                    console.log("<><><><<>")
                    console.log("FILEDATA", panImage);
                    const panUid = await triggerApiWithImage(panImage, 'PAN_CARD_FRONT');
                    console.log("RESPONSE", panUid);
                    setPostDataOfImage('panCardFront', panUid);
                    
                }

                AsyncStorage.setItem('VGUSER', JSON.stringify(postData)).then(() => {
                    navigation.navigate('PreviewReUpdateKyc');
                });
            } else {
                setPopupVisible(true);
                setPopupContent(errors.map((error, index) => <Text key={index}>{error}</Text>));
            }
        } catch (error) {
            console.error('Error in InitiatePreview:', error);
        }
    };


    const handleChange = (label: string, value: string) => {
        if (label === 'isShopDifferent') {
            setIsShopAddressDifferent(value);
            if (value == "Yes") {
                setPostData((prevData: UserData) => ({
                    ...prevData,
                    currentAddress: postData.permanentAddress,
                    currStreetAndLocality: postData.streetAndLocality,
                    currLandmark: postData.landmark,
                    currCity: postData.city,
                    currCityId: postData.cityId,
                    currDistId: postData.distId,
                    currDist: postData.dist,
                    currStateId: postData.stateId,
                    currState: postData.state,
                    currPinCode: postData.pinCode
                }))
            }
        } else if (label === 'kycDetails.gstYesNo') {
            setPostData((prevData: UserData) => ({
                ...prevData,
                kycDetails: {
                    ...prevData.kycDetails,
                    gstYesNo: value,
                },
            }));
        }
    };

    const handleInputChange = (value: string, label: string) => {
        const updatedData: UserData | any = { ...postData };

        if (label.startsWith('kycDetails.')) {
            const kycLabel = label.replace('kycDetails.', '');
            updatedData.kycDetails = {
                ...updatedData.kycDetails,
                [kycLabel]: value,
            };
        } else {
            updatedData[label] = value;
        }

        const errors: string[] = validateField(label, value, updatedData);
        setValidationErrors(errors);

        setPostData(updatedData);
    };



    const selectYesorNo = [
        { label: 'Select Option', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    const [idFrontFileData, setIdFrontFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [idBackFileData, setIdBackFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [panFileData, setPanFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })
    const [GstFileData, setGstFileData] = useState({
        uri: "",
        name: "",
        type: ""
    })

    const handleImageChange = async (image: string, type: string, imageName: string, label: string) => {
        let fileData = {
            uri: image,
            name: imageName,
            type: type,
          };
          console.log(fileData)
        try {
            if (label === "Aadhar Card* (Front)") {
                setIdFrontFileData(fileData)
            } else if (label === "Aadhar Card* (Back)") {
                setIdBackFileData(fileData)
            } else if (label === "Pan Card* (Front)") {
                setPanFileData(fileData)
            } else if (label === "GST Photo") {
                setGstFileData(fileData)
            }

        } catch (error) {
            console.error('Error handling image change in Update Kyc:', error);
        }
    };

    const setPostDataOfImage = (label: string, value: string) => {
        setPostData((prevData: UserData) => ({
            ...prevData,
            kycDetails: {
                ...prevData.kycDetails,
                [label]: value,
            }
        }));
    }

    const handleStateSelect = async (text: string, type: string) => {
        const selectedCategory = states.find(category => category.stateName === text);
        if (type == "permanent") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                state: text,
                stateId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                currState: text,
                currStateId: selectedCategory?.id || null,
            }));
        }
        getDistricts(selectedCategory?.id)
            .then(response => response.data)
            .then((data) => {
                setDistricts(data);
            })
    }
    const handleDistrictSelect = async (text: string, type: string) => {
        const selectedCategory = districts.find(category => category.districtName === text);
        if (type == "permanent") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                dist: text,
                distId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                currDist: text,
                currDistId: selectedCategory?.id || null,
            }));
        }
        getCities(selectedCategory?.id)
            .then(response => response.data)
            .then((data) => {
                setCities(data);
            })
    }
    const handleCitySelect = async (text: string, type: string) => {
        const selectedCategory = cities.find(category => category.cityName === text);
        if (type == "permanent") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                city: text,
                cityId: selectedCategory?.id || null,
            }));
        }
        else if (type == "current") {
            setPostData((prevData: UserData) => ({
                ...prevData,
                currCity: text,
                currCityId: selectedCategory?.id || null,
            }));
        }
    }

    return (
        <ScrollView style={styles.mainWrapper}>
            {/* {loader && <Loader />} */}
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 10,
                borderRadius: 5,
                height: 40,
                width: '90%',
                backgroundColor: colors.yellow,
                elevation: 10
            }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Edit your details below</Text>
            </View>
            <View style={styles.detailsContainer}>
                <View style={{ gap: 10, marginBottom: 20 }}>
                    <View style={{ display: 'flex' }}>
                        <Text style={{
                            borderWidth: 1,
                            borderColor: colors.grey,
                            padding: 10,
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: colors.grey,
                            height: 'auto',
                            width: 'auto',
                            alignSelf: 'flex-start',
                            borderRadius: 5
                        }}>
                            Remarks
                        </Text>
                    </View>
                    <View style={styles.reasons}>
                            <Text style={{ color: 'red' }}>{postData?.rejectedReasonsStr || ''}</Text>
                    </View>
                </View>
                <InputField
                    label={t('strings:retailer_name')}
                    value={postData?.name}
                    onChangeText={(text) => handleInputChange(text, 'name')}
                />
                <InputField
                    label={t('strings:contact_number')}
                    value={postData?.contactNo}
                    disabled={true}
                />
                <InputField
                    label={t('strings:store_firm_name')}
                    value={postData?.firmName}
                    onChangeText={(text) => handleInputChange(text, 'firmName')}
                />
                <Text style={styles.subHeading}>{t('strings:permanent_address')}</Text>
                <InputField
                    label={t('strings:lbl_permanent_address_mandatory')}
                    value={postData?.permanentAddress}
                    onChangeText={(text) => handleInputChange(text, 'permanentAddress')}
                />
                <InputField
                    label={t('strings:lbl_street_locality')}
                    value={postData?.streetAndLocality}
                    onChangeText={(text) => handleInputChange(text, 'streetAndLocality')}
                />
                <InputField
                    label={t('strings:lbl_landmark')}
                    value={postData?.landmark}
                    onChangeText={(text) => handleInputChange(text, 'landmark')}
                />
                <InputField
                    label={t('strings:pincode')}
                    value={postData?.pinCode}
                    onChangeText={(text) => handleInputChange(text, 'pinCode')}
                    numeric
                    maxLength={6}
                />
                <PickerField
                    label={t('strings:lbl_state')}
                    disabled={false}
                    selectedValue={postData?.state}
                    onValueChange={(text: string) => handleStateSelect(text, "permanent")}
                    items={states.map(state => ({ label: state.stateName, value: state.stateName }))}
                />
                <PickerField
                    label={t('strings:district')}
                    disabled={false}
                    selectedValue={postData?.dist}
                    onValueChange={(text: string) => handleDistrictSelect(text, "permanent")}
                    items={districts.map(district => ({ label: district.districtName, value: district.districtName }))}
                />
                <PickerField
                    label={t('strings:city')}
                    disabled={false}
                    selectedValue={postData?.city}
                    onValueChange={(text: string) => handleCitySelect(text, "permanent")}
                    items={cities.map(city => ({ label: city.cityName, value: city.cityName }))}
                />
                <PickerField
                    label={t('strings:is_shop_address_different')}
                    selectedValue={isShopAddressDifferent}
                    onValueChange={(text: string) => handleChange("isShopDifferent", text)}
                    items={selectYesorNo}
                />
                {isShopAddressDifferent == "No" ? (
                    <>
                        <Text style={styles.subHeading}>{t('strings:current_address')}</Text>

                        <InputField
                            label={t('strings:lbl_current_address_mandatory')}
                            value={postData?.currentAddress}
                            onChangeText={(text) => handleInputChange(text, 'currentAddress')}
                        />
                        <InputField
                            label={t('strings:lbl_street_locality')}
                            value={postData?.currStreetAndLocality}
                            onChangeText={(text) => handleInputChange(text, 'currStreetAndLocality')}
                        />
                        <InputField
                            label={t('strings:lbl_landmark')}
                            value={postData?.currLandmark}
                            onChangeText={(text) => handleInputChange(text, 'currLandmark')}
                        />
                        <InputField
                            label={t('strings:pincode')}
                            value={postData?.currPinCode}
                            onChangeText={(text) => handleInputChange(text, 'currPinCode')}
                            numeric
                            maxLength={6}
                        />
                        <PickerField
                            label={t('strings:lbl_state')}
                            disabled={false}
                            selectedValue={postData?.currState}
                            onValueChange={(text: string) => handleStateSelect(text, 'current')}
                            items={states.map(state => ({ label: state.stateName, value: state.stateName }))}
                        />
                        <PickerField
                            label={t('strings:district')}
                            disabled={false}
                            selectedValue={postData?.currDist}
                            onValueChange={(text: string) => handleDistrictSelect(text, 'current')}
                            items={districts.map(district => ({ label: district.districtName, value: district.districtName }))}
                        />
                        <PickerField
                            label={t('strings:city')}
                            disabled={false}
                            selectedValue={postData?.currCity}
                            onValueChange={(text: string) => handleCitySelect(text, 'current')}
                            items={cities.map(city => ({ label: city.cityName, value: city.cityName }))}
                        />
                    </>
                ) : null}
                <InputField
                    label={t('strings:aadhar_card_no')}
                    value={postData?.kycDetails?.aadharOrVoterOrDlNo}
                    onChangeText={(text) => handleInputChange(text, 'kycDetails.aadharOrVoterOrDlNo')}
                    numeric
                    maxLength={12}
                />
                <ImagePickerField label='Aadhar Card* (Front)'
                    onImageChange={handleImageChange}
                    imageRelated='ID_CARD_FRONT'
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDLFront}
                />
                <ImagePickerField label='Aadhar Card* (Back)'
                    onImageChange={handleImageChange}
                    imageRelated="ID_CARD_BACK"
                    initialImage={postData?.kycDetails?.aadharOrVoterOrDlBack}
                />
                <ImagePickerField label='Pan Card* (Front)'
                    onImageChange={handleImageChange}
                    imageRelated="PAN_CARD_FRONT"
                    initialImage={postData?.kycDetails?.panCardFront}
                />
                <InputField
                    label={t('strings:update_pan_number_manually')}
                    value={postData?.kycDetails?.panCardNo}
                    onChangeText={(text) => handleInputChange(text, 'kycDetails.panCardNo')}
                />
                <PickerField
                    label={t('strings:do_you_have_gst_number')}
                    selectedValue={postData?.kycDetails?.gstYesNo}
                    onValueChange={(text: string) => handleChange("kycDetails.gstYesNo", text)}
                    items={selectYesorNo}
                />
                {postData?.kycDetails?.gstYesNo == "Yes" ? (
                    <>
                        <InputField
                            label={t('strings:gst_no')}
                            value={postData?.kycDetails?.gstNo}
                            onChangeText={(text) => handleInputChange(text, 'kycDetails.gstNo')}
                        />
                        <ImagePickerField
                            label='GST Photo'
                            onImageChange={handleImageChange}
                            imageRelated="GST"
                            initialImage={postData?.kycDetails?.gstFront}
                        />
                    </>
                ) : null}

                <View style={styles.button}>
                    <Buttons
                        label={t('strings:preview')}
                        variant="filled"
                        onPress={() => InitiatePreview()}
                        width="100%"
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
}

const styles = StyleSheet.create({
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
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center'
    },
    subHeading: {
        color: colors.grey,
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        marginBottom: 30
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
    reasons: {
        borderWidth: 1,
        borderColor: colors.grey,
        padding: 10,
        borderRadius: 5
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
});

export default ReUpdateKyc;
