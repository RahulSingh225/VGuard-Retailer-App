interface BankDetail {
    errorMessage: null | string;
    bankId: string;
    bankAccNo: string;
    bankAccHolderName: string;
    bankAccType: null | string;
    bankAccTypePos: null | string;
    bankNameAndBranch: string;
    branchAddress: string;
    bankIfsc: string;
    nomineeName: null | string;
    nomineeDob: null | string;
    checkPhoto: string;
    nomineeMobileNo: null | string;
    nomineeEmail: null | string;
    nomineeAdd: null | string;
    nomineeRelation: null | string;
    nomineeAccNo: null | string;
    bankDataPresent: null | string;
}

interface PointsSummary {
    pointsBalance: string;
    redeemedPoints: string;
    numberOfScan: string;
    tdsPoints: string;
    schemePoints: null | string;
    totalPointsRedeemed: null | string;
    totalPointsEarned: null | string;
}

interface KycDetails {
    kycFlag: string;
    userId: null | string;
    kycIdName: null | string;
    kycId: null | string;
    selfie: string;
    aadharOrVoterOrDLFront: string;
    aadharOrVoterOrDlBack: string;
    aadharOrVoterOrDlNo: string;
    panCardFront: null | string;
    panCardBack: null | string;
    panCardNo: null | string;
    gstFront: null | string;
    gstNo: null | string;
    gstYesNo: null | string;
}

interface WelcomeBanner {
    code: number;
    textMessage: string;
    videoPath: string;
    imgPath: string;
    vdoText: string;
}

export interface UserData {
    appVersionCode: string;
    retailerAppVersionCode: string;
    egvEnabled: string;
    otpType: null;
    welcomePointsMsg: string;
    welcomePointsErrorCode: number;
    ecardPath: string;
    userId: string;
    password: string;
    inAllow: number;
    userCode: string;
    emailId: string;
    enrolledOtherScheme: number;
    enrolledOtherSchemeYesNo: string;
    maritalStatus: string;
    maritalStatusId: number;
    distId: string;
    cityId: string;
    addDiff: number;
    houseFlatNo: null;
    userProfession: number;
    professionId: number;
    subProfessionId: number;
    profession: null;
    loginOtpUserName: null;
    mobileNo: string;
    otp: null;
    preferredLanguage: string;
    preferredLanguagePos: null;
    referralCode: null;
    nameOfReferee: null;
    name: string;
    gender: string;
    genderPos: null;
    dob: string;
    contactNo: string;
    whatsappNo: null;
    permanentAddress: string;
    streetAndLocality: string;
    landmark: string;
    city: string;
    dist: string;
    state: string;
    stateId: string;
    pinCode: string;
    currentAddress: string;
    currStreetAndLocality: string;
    currLandmark: string;
    currCity: string;
    currCityId: string;
    currDistId: string;
    currDist: string;
    currState: null;
    currStateId: string;
    currPinCode: string;
    otherCity: null;
    otherCurrCity: null;
    otherSchemeBrand: string;
    abtOtherSchemeLiked: string;
    otherSchemeBrand2: string;
    abtOtherSchemeLiked2: string;
    otherSchemeBrand3: string;
    abtOtherSchemeLiked3: string;
    otherSchemeBrand4: string;
    abtOtherSchemeLiked4: string;
    otherSchemeBrand5: string;
    abtOtherSchemeLiked5: string;
    annualBusinessPotential: number;
    bankDetail: BankDetail;
    pointsSummary: PointsSummary;
    kycDetails: KycDetails;
    rejectedReasonsStr: string;
    roleId: string;
    gstNo: string;
    gstYesNo: string;
    gstPic: string;
    categoryDealInID: string;
    categoryDealIn: string;
    aspireGift: string;
    firmName: string;
    tierFlag: null;
    fcmToken: null;
    active: string;
    airCoolerEnabled: string;
    welcomeBanner: WelcomeBanner;
    updateAccount: string;
    islead: null;
    diffAcc: null;
}
