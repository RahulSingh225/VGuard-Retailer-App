interface BankDetail {
    errorMessage: string | "";
    bankId: string | "";
    bankAccNo: string | "";
    bankAccHolderName: string | "";
    bankAccType: string | "";
    bankAccTypePos: string | "";
    bankNameAndBranch: string | "";
    branchAddress: string | "";
    bankIfsc: string | "";
    nomineeName: string | "";
    nomineeDob: string | "";
    checkPhoto: string | "";
    nomineeMobileNo: string | "";
    nomineeEmail: string | "";
    nomineeAdd: string | "";
    nomineeRelation: string | "";
    nomineeAccNo: string | "";
    bankDataPresent: string | "";
}

interface PointsSummary {
    pointsBalance: string | "";
    redeemedPoints: string | "";
    numberOfScan: string | "";
    tdsPoints: string | "";
    schemePoints: string | "";
    totalPointsRedeemed: string | "";
    totalPointsEarned: string | "";
}

interface KycDetails {
    kycFlag: string | "";
    userId: string | "";
    kycIdName: string | "";
    kycId: string | "";
    selfie: string | "";
    aadharOrVoterOrDLFront: string | "";
    aadharOrVoterOrDlBack: string | "";
    aadharOrVoterOrDlNo: string | "";
    panCardFront: string | "";
    panCardBack: string | "";
    panCardNo: string | "";
    gstFront: string | "";
    gstNo: string | "";
    gstYesNo: string | "";
}

interface WelcomeBanner {
    code: number | 0;
    textMessage: string | "";
    videoPath: string | "";
    imgPath: string | "";
    vdoText: string | "";
}

interface Tokens {
    accessToken: string
    refreshToken: string
}

export interface VguardRishtaUser {
    appVersionCode: string | "";
    retailerAppVersionCode: string | "";
    egvEnabled: string | "";
    otpType: string | "";
    welcomePointsMsg: string | "";
    welcomePointsErrorCode: number | 0;
    ecardPath: string | "";
    userId: string | "";
    password: string | "";
    inAllow: number | 0;
    userCode: string | "";
    emailId: string | "";
    enrolledOtherScheme: number | 0;
    enrolledOtherSchemeYesNo: string | "";
    maritalStatus: string | "";
    maritalStatusId: number | 0;
    distId: number | 0;
    cityId: number | 0;
    addDiff: number | 0;
    houseFlatNo: string | "";
    userProfession: number | 0;
    professionId: number | 0;
    subProfessionId: number | 0;
    profession: string | "";
    loginOtpUserName: string | "";
    mobileNo: string | "";
    otp: string | "";
    preferredLanguage: string | "";
    preferredLanguagePos: string | "";
    referralCode: string | "";
    nameOfReferee: string | "";
    name: string | "";
    gender: string | "";
    genderPos: string | "";
    dob: string | "";
    contactNo: string | "";
    whatsappNo: string | "";
    permanentAddress: string | "";
    streetAndLocality: string | "";
    landmark: string | "";
    city: string | "";
    dist: string | "";
    state: string | "";
    stateId: number | 0;
    pinCode: string | "";
    currentAddress: string | "";
    currStreetAndLocality: string | "";
    currLandmark: string | "";
    currCity: string | "";
    currCityId: number | 0;
    currDistId: number | 0;
    currDist: string | "";
    currState: string | "";
    currStateId: number | 0;
    currPinCode: string | "";
    otherCity: string | "";
    otherCurrCity: string | "";
    otherSchemeBrand: string | "";
    abtOtherSchemeLiked: string | "";
    otherSchemeBrand2: string | "";
    abtOtherSchemeLiked2: string | "";
    otherSchemeBrand3: string | "";
    abtOtherSchemeLiked3: string | "";
    otherSchemeBrand4: string | "";
    abtOtherSchemeLiked4: string | "";
    otherSchemeBrand5: string | "";
    abtOtherSchemeLiked5: string | "";
    annualBusinessPotential: number | 0;
    bankDetail: BankDetail;
    pointsSummary: PointsSummary;
    kycDetails: KycDetails;
    rejectedReasonsStr: string | "";
    roleId: string | "";
    gstNo: string | "";
    gstYesNo: string | "";
    gstPic: string | "";
    categoryDealInID: string | "";
    categoryDealIn: string | "";
    aspireGift: string | "";
    firmName: string | "";
    tierFlag: string | "";
    fcmToken: string | "";
    active: string | "";
    airCoolerEnabled: string | "";
    welcomeBanner: WelcomeBanner;
    updateAccount: string | "";
    islead: string | "";
    diffAcc: string | "";
}

export interface User {
    vguardRishtaUser: VguardRishtaUser;
    tokens: Tokens;
}

export interface State {
    stateId: number | 0;
    stateName: string | "";
}
export interface Cities {
    cityId: number | 0;
    cityName: string | "";
}
export interface District {
    distId: number | 0;
    districtName: string | "";
}

