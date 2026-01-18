import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const KYC = ({navigation, route}) => {
  const {profileData} = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <AntDesign name="arrowleft" color="black" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={{color: 'black', fontSize: 16}}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={22}
              color="green"
            />{' '}
            Become a verified business now!
          </Text>
          <Text style={{fontSize: 10, alignSelf: 'center', marginTop: 5}}>
            It's paperless and just takes 2 minutes
          </Text>
        </View>
      </View>
      <Text style={{marginVertical: 20, marginHorizontal: 20, color: 'black'}}>
        Personal Verification
      </Text>
      {profileData?.mainDetail?.get_user_party_detail?.aadhaar_front_image !==
        null &&
      profileData?.mainDetail?.get_user_party_detail?.aadhaar_back_image !==
        null &&
      profileData?.mainDetail?.get_user_party_detail?.pan_image !== null ? (
        <View style={styles.statusVerifiedContainer}>
          <MaterialIcons
            name={
              profileData?.mainDetail?.get_user_party_detail?.is_kyc === 1
                ? 'verified-user'
                : 'hourglass-top'
            }
            size={28}
            color="orange"
          />
          <Text
            style={{
              color: 'black',
              fontSize: 19,
              fontWeight: '600',
              flexShrink: 1,
            }}>
            {profileData?.mainDetail?.get_user_party_detail?.is_kyc === 1 ? (
              <>
                You're Now{' '}
                <Text style={{color: 'orange'}}>Aadhaar & PAN Verified</Text>
              </>
            ) : (
              "You're Aadhaar & PAN Under Verification"
            )}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Aadhaar&PANVerification', {
              step1Completed:
                profileData?.mainDetail?.get_user_party_detail
                  ?.aadhaar_front_image !== null
                  ? true
                  : false,
            })
          }>
          <View style={styles.cardContent}>
            <Image
              source={require('../../../assets/images/aadhar.png')}
              style={{width: 50, height: 50}}
            />
            <Image
              source={require('../../../assets/images/driving-license.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                color: 'black',
                marginLeft: 5,
                marginRight: 10,
                fontSize: 14,
              }}>
              Verify your Aadhar & PAN
            </Text>
            <AntDesign name="right" color="black" size={16} />
          </View>
        </TouchableOpacity>
      )}
      <Text style={{marginVertical: 20, marginHorizontal: 20, color: 'black'}}>
        Business Verification
      </Text>
      {profileData?.mainDetail?.get_user_party_detail?.gst_no !== null ? (
        <View style={styles.statusVerifiedContainer}>
          <MaterialIcons
            name={
              profileData?.mainDetail?.get_user_party_detail?.is_kyc === 1
                ? 'verified-user'
                : 'hourglass-top'
            }
            size={28}
            color="green"
          />
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: '600',
              flexShrink: 1,
            }}>
            <>
              You're now <Text style={{color: 'green'}}>Business Verified</Text>
            </>
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('GSTVerification')}>
          <View style={styles.cardContent}>
            <Image
              source={require('../../../assets/images/driving-license.png')}
              style={{width: 50, height: 50}}
            />
            <Text
              style={{
                color: 'black',
                marginLeft: 5,
                marginRight: '40%',
                fontSize: 14,
              }}>
              Verify your GST
            </Text>
            <AntDesign name="right" color="black" size={16} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#dfe7f5',
    height: '15%',
  },
  backBtn: {
    padding: 10,
    marginTop: 15,
  },
  headerContent: {
    alignSelf: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#ebeced',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#000',
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
});

export default KYC;
