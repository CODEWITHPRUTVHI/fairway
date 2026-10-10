export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  appName: string;
  nashikDistrict: string;
  autoPool: string;
  passenger: string;
  autoDriver: string;
  opsDispatch: string;
  testSuite: string;
  whereTo: string;
  pickupStand: string;
  destination: string;
  selectAutoTier: string;
  shareAuto: string;
  soloAuto: string;
  saveUpTo: string;
  costSplitTitle: string;
  costSplitDesc: string;
  womenOnlyPool: string;
  womenOnlySub: string;
  payCash: string;
  payUPI: string;
  bookShareAuto: string;
  searchingAuto: string;
  scanningCorridors: string;
  groupCreated: string;
  groupIdOtp: string;
  otpExplanation: string;
  autoPickupPoint: string;
  walkToStand: string;
  iAmReady: string;
  readyAtStand: string;
  autoBooked: string;
  autoEnRoute: string;
  autoArrived: string;
  tripInProgress: string;
  destinationReached: string;
  boardingPin: string;
  givePinToDriver: string;
  driverName: string;
  rating: string;
  verifiedDriver: string;
  sosAlert: string;
  cancelRide: string;
  reviewRoute: string;
  acceptAssign: string;
  decline: string;
  dropPassenger: string;
  collectFare: string;
  tripCompleted: string;
  todayEarnings: string;
  netPayout: string;
  verifyPin: string;
  arrivedAtStand: string;
  acceptRide: string;
  declineRide: string;
  newRideRequest: string;
  passengers: string;
  totalPooledFare: string;
  dropSequence: string;
  switchLanguage: string;
  findStrangers: string;
  phase1: string;
  phase2: string;
  phase3: string;
  scanning1km: string;
  expandingScan: string;
  maxRadiusScan: string;
  midpointMeeting: string;
  paymentReminder: string;
  instantMatch: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'FAIRWAY NASHIK',
    nashikDistrict: 'Nashik District',
    autoPool: 'MH-15 AUTO POOL',
    passenger: 'Passenger',
    autoDriver: 'Auto Driver',
    opsDispatch: 'Ops & Dispatch',
    testSuite: 'Test Suite',
    whereTo: 'Where to in Nashik?',
    pickupStand: 'Pickup Auto Stand',
    destination: 'Destination',
    selectAutoTier: 'Select Auto Rickshaw Tier',
    shareAuto: 'Share-Auto (3-Seater Pool)',
    soloAuto: 'Solo Auto (Private Ride)',
    saveUpTo: 'Save up to 55%',
    costSplitTitle: 'Dynamic Fair Cost Splitting',
    costSplitDesc: 'If a passenger drops midway at Stop B, the fare splits fairly among all riders!',
    womenOnlyPool: 'Women-Only Auto Pool (सखी)',
    womenOnlySub: 'Verified female co-passengers only',
    payCash: '₹ Cash to Auto Kaka',
    payUPI: 'UPI / Online Wallet',
    bookShareAuto: 'Book Share-Auto',
    searchingAuto: 'Matching Nashik Auto Passengers...',
    scanningCorridors: 'Scanning CBS, College Road & Gangapur Road...',
    groupCreated: 'Auto Rickshaw Group Created!',
    groupIdOtp: 'Group ID & Ride OTP',
    otpExplanation: 'This 4-digit Group ID acts as your OTP for the driver',
    autoPickupPoint: 'Designated Auto Stand Pickup',
    walkToStand: 'Walk to safe boarding stand',
    iAmReady: "I am Ready at Stand",
    readyAtStand: 'Ready at Auto Stand',
    autoBooked: 'Auto Auto-Booked!',
    autoEnRoute: 'Auto En-Route to Auto Stand',
    autoArrived: 'Auto Arrived at Stand',
    tripInProgress: 'Trip In Progress',
    destinationReached: 'Destination Reached!',
    boardingPin: 'Boarding PIN / OTP',
    givePinToDriver: 'Show this 4-digit code to Auto Kaka',
    driverName: 'Driver Name',
    rating: 'Rating',
    verifiedDriver: 'Verified Nashik Auto Driver',
    sosAlert: 'NASHIK POLICE SOS',
    cancelRide: 'Cancel Ride',
    reviewRoute: 'Review Shared Auto Route',
    acceptAssign: 'Accept & Book Auto',
    decline: 'Decline',
    dropPassenger: 'Drop Passenger',
    collectFare: 'Collect Fare',
    tripCompleted: 'Trip Completed',
    todayEarnings: "Today's Auto Earnings",
    netPayout: 'Net Driver Payout',
    verifyPin: 'Verify Passenger Boarding PIN / OTP',
    arrivedAtStand: 'Arrived at Auto Stand',
    acceptRide: 'Accept Auto Pool Ride',
    declineRide: 'Decline',
    newRideRequest: 'New Shared Auto Request!',
    passengers: 'Passengers',
    totalPooledFare: 'Total Pooled Fare',
    dropSequence: 'Sequential Dropoff Stops (1 by 1)',
    switchLanguage: 'Language',
    findStrangers: 'Find Strangers for Ride',
    phase1: 'Phase 1: 1.0 km Anchor Scan',
    phase2: 'Phase 2: Expanded Scan (+200m)',
    phase3: 'Phase 3: Max 1.4 km Corridor Scan',
    scanning1km: 'Scanning 1.0 km diameter for co-passengers...',
    expandingScan: 'Expanding scan diameter by +200m...',
    maxRadiusScan: 'Final 1-minute scan at maximum radius...',
    midpointMeeting: 'Mid Meeting Point',
    paymentReminder: 'Send Fare Payment Reminder',
    instantMatch: 'Instant Stranger Match',
  },
  mr: {
    appName: 'फेअरवे नाशिक',
    nashikDistrict: 'नाशिक जिल्हा',
    autoPool: 'MH-15 शेअर रिक्षा पूल',
    passenger: 'प्रवासी',
    autoDriver: 'रिक्षा चालक',
    opsDispatch: 'कंट्रोल कक्ष',
    testSuite: 'चाचणी सूट',
    whereTo: 'नाशिकमध्ये कुठे जायचे?',
    pickupStand: 'पिकअप रिक्षा स्टँड',
    destination: 'गंतव्य स्थान',
    selectAutoTier: 'रिक्षा प्रकार निवडा',
    shareAuto: 'शेअर रिक्षा (३ आसनी पूल)',
    soloAuto: 'प्रायव्हेट रिक्षा (एकटे जा)',
    saveUpTo: '५५% पर्यंत बचत',
    costSplitTitle: 'किफायतशीर भाडे विभागणी',
    costSplitDesc: 'जर कोणी मध्येच स्टॉप बी वर उतरले, तर उर्वरित भाडे योग्य रीतीने विभागले जाईल!',
    womenOnlyPool: 'महिला सखी रिक्षा पूल',
    womenOnlySub: 'फक्त सत्यापित महिला सहप्रवासी',
    payCash: '₹ रिक्षा काकांना रोख द्या',
    payUPI: 'युपीआय / ऑनलाइन वॉलेट',
    bookShareAuto: 'शेअर रिक्षा बुक करा',
    searchingAuto: 'नाशिक सहप्रवासी शोधत आहे...',
    scanningCorridors: 'सीबीएस, कॉलेज रोड आणि गंगापूर रोड कॉरिडॉर स्कॅन करत आहे...',
    groupCreated: 'रिक्षा ग्रुप तयार झाला!',
    groupIdOtp: 'ग्रुप आयडी आणि राइड ओटीपी',
    otpExplanation: 'हा ४ अंकी ग्रुप आयडी रिक्षा चालकांसाठी ओटीपी (OTP) म्हणून कार्य करतो',
    autoPickupPoint: 'निश्चित रिक्षा पिकअप पॉईंट',
    walkToStand: 'रिक्षा स्टँडवर चालून जा',
    iAmReady: 'मी स्टँडवर तयार आहे',
    readyAtStand: 'स्टँडवर तयार',
    autoBooked: 'रिक्षा आपोआप बुक झाली!',
    autoEnRoute: 'रिक्षा स्टँडकडे येत आहे',
    autoArrived: 'रिक्षा स्टँडवर आली आहे',
    tripInProgress: 'रिक्षा प्रवास सुरू आहे',
    destinationReached: 'गंतव्य स्थानी पोहोचलो!',
    boardingPin: 'बोर्डिंग पिन / ओटीपी',
    givePinToDriver: 'हा ४ अंकी कोड रिक्षा काकांना सांगा',
    driverName: 'चालकाचे नाव',
    rating: 'रेटिंग',
    verifiedDriver: 'सत्यापित नाशिक रिक्षा चालक',
    sosAlert: 'नाशिक पोलीस मदतीसाठी SOS',
    cancelRide: 'राइड रद्द करा',
    reviewRoute: 'शेअर रिक्षा मार्ग तपासा',
    acceptAssign: 'स्वीकारा आणि रिक्षा बुक करा',
    decline: 'नकार द्या',
    dropPassenger: 'प्रवाशाला सोडा',
    collectFare: 'भाडे जमा करा',
    tripCompleted: 'प्रवास पूर्ण झाला',
    todayEarnings: 'आजची रिक्षा कमाई',
    netPayout: 'चालकाचे निव्वळ उत्पन्न',
    verifyPin: 'प्रवासी पिन / ओटीपी तपासा',
    arrivedAtStand: 'मी रिक्षा स्टँडवर पोहोचलो',
    acceptRide: 'रिक्षा राइड स्वीकारा',
    declineRide: 'नाकारा',
    newRideRequest: 'नवीन शेअर रिक्षा बुकिंग!',
    passengers: 'प्रवासी',
    totalPooledFare: 'एकूण एकत्रित भाडे',
    dropSequence: 'एकामागून एक प्रवाशांचे स्टॉप',
    switchLanguage: 'भाषा',
    findStrangers: 'नवीन सहप्रवासी शोधा (स्ट्रेंजर पूल)',
    phase1: 'टप्पा १: १.० किमी व्यास स्कॅन',
    phase2: 'टप्पा २: वाढीव स्कॅन (+२०० मी)',
    phase3: 'टप्पा ३: कमाल १.४ किमी कॉरिडॉर स्कॅन',
    scanning1km: '१.० किमी परिघात सहप्रवासी शोधत आहे...',
    expandingScan: 'स्कॅन व्यास २०० मीटरने वाढवत आहे...',
    maxRadiusScan: 'शेवटच्या १ मिनिटात कमाल परिघात शोध...',
    midpointMeeting: 'मध्यवर्ती भेट ठिकाण',
    paymentReminder: 'भाडे देण्याची आठवण पाठवा',
    instantMatch: 'त्वरित सहप्रवासी मिळवा',
  },
  hi: {
    appName: 'फेयरवे नासिक',
    nashikDistrict: 'नासिक जिला',
    autoPool: 'MH-15 शेयर ऑटो पूल',
    passenger: 'यात्री',
    autoDriver: 'ऑटो चालक',
    opsDispatch: 'कंट्रोल रूम',
    testSuite: 'टेस्ट सूट',
    whereTo: 'नासिक में कहाँ जाना है?',
    pickupStand: 'पिकअप ऑटो स्टैंड',
    destination: 'गंतव्य स्थान',
    selectAutoTier: 'ऑटो रिक्शा प्रकार चुनें',
    shareAuto: 'शेयर ऑटो (3-सीटर पूल)',
    soloAuto: 'सोलो ऑटो (निजी ऑटो)',
    saveUpTo: '55% तक की बचत',
    costSplitTitle: 'किफायती किराया विभाजन',
    costSplitDesc: 'अगर कोई बीच में स्टॉप बी पर उतरता है, तो किराया सही अनुपात में बंट जाएगा!',
    womenOnlyPool: 'महिला सखी ऑटो पूल',
    womenOnlySub: 'केवल सत्यापित महिला सह-यात्री',
    payCash: '₹ ऑटो काका को नकद दें',
    payUPI: 'यूपीआई / ऑनलाइन वॉलेट',
    bookShareAuto: 'शेयर ऑटो बुक करें',
    searchingAuto: 'नासिक सह-यात्री खोज रहे हैं...',
    scanningCorridors: 'सीबीएस, कॉलेज रोड और गंगापुर रोड स्कैन हो रहा है...',
    groupCreated: 'ऑटो रिक्शा ग्रुप बन गया!',
    groupIdOtp: 'ग्रुप आईडी और राइड ओटीपी',
    otpExplanation: 'यह 4-अंकीय ग्रुप आईडी ड्राइवर के लिए ओटीपी (OTP) का काम करती है',
    autoPickupPoint: 'निर्धारित ऑटो स्टैंड पिकअप',
    walkToStand: 'ऑटो स्टैंड तक जाएं',
    iAmReady: 'मैं स्टैंड पर तैयार हूँ',
    readyAtStand: 'स्टैंड पर तैयार',
    autoBooked: 'ऑटो ऑटो-बुक हो गया!',
    autoEnRoute: 'ऑटो स्टैंड की ओर आ रहा है',
    autoArrived: 'ऑटो स्टैंड पर पहुंच गया',
    tripInProgress: 'ऑटो यात्रा जारी है',
    destinationReached: 'मंजिल पर पहुंच गए!',
    boardingPin: 'बोर्डिंग पिन / ओटीपी',
    givePinToDriver: 'यह 4 अंकों का कोड ऑटो काका को बताएं',
    driverName: 'चालक का नाम',
    rating: 'रेटिंग',
    verifiedDriver: 'सत्यापित नासिक ऑटो चालक',
    sosAlert: 'नासिक पुलिस SOS',
    cancelRide: 'सवारी रद्द करें',
    reviewRoute: 'शेयर ऑटो मार्ग देखें',
    acceptAssign: 'स्वीकारें और ऑटो बुक करें',
    decline: 'अस्वीकार करें',
    dropPassenger: 'यात्री को उतारें',
    collectFare: 'किराया लें',
    tripCompleted: 'यात्रा पूर्ण',
    todayEarnings: 'आज की ऑटो कमाई',
    netPayout: 'चालक की शुद्ध कमाई',
    verifyPin: 'यात्री पिन / ओटीपी सत्यापित करें',
    arrivedAtStand: 'मैं ऑटो स्टैंड पर पहुंच गया',
    acceptRide: 'ऑटो पूल राइड स्वीकारें',
    declineRide: 'अस्वीकार करें',
    newRideRequest: 'नई शेयर ऑटो बुकिंग!',
    passengers: 'यात्री',
    totalPooledFare: 'कुल एकत्रित किराया',
    dropSequence: 'एक-एक करके यात्रियों के स्टॉप',
    switchLanguage: 'भाषा',
    findStrangers: 'सह-यात्री खोजें (अजनबी साथी पूल)',
    phase1: 'चरण 1: 1.0 किमी व्यास स्कैन',
    phase2: 'चरण 2: विस्तारित स्कैन (+200 मी)',
    phase3: 'चरण 3: अधिकतम 1.4 किमी कॉरिडोर स्कैन',
    scanning1km: '1.0 किमी व्यास में सह-यात्रियों की खोज...',
    expandingScan: 'स्कैन व्यास 200 मीटर बढ़ाया जा रहा है...',
    maxRadiusScan: 'अंतिम 1 मिनट में अधिकतम त्रिज्या पर खोज...',
    midpointMeeting: 'मध्य मिलन स्थल',
    paymentReminder: 'किराया भुगतान अनुस्मारक भेजें',
    instantMatch: 'तुरंत साथी खोजें',
  },
};
