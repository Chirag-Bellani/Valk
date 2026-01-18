import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProfileStyles from '../../../assets/styles/profile';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {API_ENDPOINTS} from '../../../constants/apiEndPoints';
import {apiPost} from '../../../services/apiUtility';
import {getJoinedDateDifference} from '../../../utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserProfile = ({route}) => {
  console.log('UserProfile route:', route.params);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileDetail, setProfileDetail] = useState([]);
  const [showAllFleets, setShowAllFleets] = useState(false);
  const displayedMaterials = showAllMaterials
    ? profileDetail?.handledMaterials || []
    : profileDetail?.handledMaterials?.slice(0, 4) || [];

  const displayedStates = showAllStates
    ? profileDetail?.mainDetail?.get_user_party_detail
        ?.get_party_state_routes || []
    : profileDetail?.mainDetail?.get_user_party_detail?.get_party_state_routes?.slice(
        0,
        4,
      ) || [];

  const displayedFleets = showAllFleets
    ? profileDetail?.fleetOwned
    : profileDetail?.fleetOwned?.slice(0, 4);

  const primaryNumber = profileDetail?.mainDetail?.calling_no;
  const alternateNumber = profileDetail?.mainDetail?.mobile_no;

  const formatNumber = number => {
    return number ? `+91 ${number.slice(0, 5)} ${number.slice(5)}` : '';
  };

  const formattedPrimary = formatNumber(primaryNumber);
  const formattedAlternate = formatNumber(alternateNumber);

  const fetchUserDetail = async userId => {
    const formData = new FormData();
    formData.append('user_id', userId);
    try {
      const response = await apiPost(API_ENDPOINTS.USER.GET_PROFILE, formData);

      if (response.success) {
        setProfileDetail(response.data);
      } else {
        console.log('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (route.params.userId) fetchUserDetail(route.params.userId);
  }, []);

  if (isLoading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: verticalScale(20)}}>
        {/* Profile Pic */}
        <View style={styles.profileContainer}>
          <View style={styles.centerAlign}>
            {profileDetail?.mainDetail?.get_user_party_detail?.party_logo ? (
              <Image
                source={{
                  uri: profileDetail.mainDetail.get_user_party_detail.image_url,
                }}
                style={ProfileStyles.profileImage}
              />
            ) : (
              <Image
                source={require('../../../assets/images/profile.png')}
                style={ProfileStyles.profileImage}
              />
            )}
          </View>
          <Text style={styles.profileName}>
            {profileDetail?.mainDetail?.company_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginHorizontal: '12%',
            }}>
            <Text style={styles.profileSubTitle}>
              {profileDetail?.mainDetail?.name}
            </Text>
            {route.params?.bidDetail?.bid_status !==
              'Negotiate_By_Transporter' &&
              route.params?.bidDetail?.bid_status !== 'Pending' &&
              route.params?.bidDetail?.bid_status !== 'Negotiate_By_Shipper' &&
              route.params?.bidDetail?.bid_status !== 'Reject' &&
              route.params?.bidDetail?.bid_status !== 'Payment_Request' && (
                <Text style={styles.profileSubTitle}>
                  {profileDetail?.mainDetail?.user_location
                    ? ` | ${profileDetail.mainDetail.user_location}`
                    : ''}
                </Text>
              )}
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          <View style={styles.historyRow}>
            <View>
              <Text style={styles.historyValue}>
                {profileDetail?.trip_completed}
              </Text>
              <Text style={styles.historyLabel}>Trips completed</Text>
            </View>
            <View>
              <Text style={styles.historyValue}>
                {profileDetail?.total_load_posted}
              </Text>
              <Text style={styles.historyLabel}>Loads posted</Text>
            </View>
            <View>
              <Text style={styles.historyValue}>
                {profileDetail?.total_lorries}
              </Text>
              <Text style={styles.historyLabel}>Lorries posted</Text>
            </View>
          </View>
        </View>

        {/* user Document */}
        <View style={ProfileStyles.verificationContainer}>
          <View style={ProfileStyles.verificationContainerHeader}>
            <Text style={ProfileStyles.verificationText}>
              Company Documents
            </Text>
          </View>
          <View style={ProfileStyles.statusContainer}>
            <View
              style={[
                ProfileStyles.aadhaarStatusContainer,
                profileDetail?.mainDetail?.get_user_party_detail?.is_kyc ===
                  1 && {backgroundColor: '#bdf7b0'},
              ]}>
              {profileDetail?.mainDetail?.get_user_party_detail?.is_kyc ===
              1 ? (
                <FontAwesome name={'check-circle'} color={'green'} size={20} />
              ) : (
                <Entypo name={'circle-with-cross'} color={'red'} size={20} />
              )}
              <Text style={ProfileStyles.statusText}>Aadhaar</Text>
            </View>
            <View
              style={[
                ProfileStyles.panStatusContainer,
                profileDetail?.mainDetail?.get_user_party_detail?.is_kyc ===
                  1 && {backgroundColor: '#bdf7b0'},
              ]}>
              {profileDetail?.mainDetail?.get_user_party_detail?.is_kyc ===
              1 ? (
                <FontAwesome name={'check-circle'} color={'green'} size={20} />
              ) : (
                <Entypo name={'circle-with-cross'} color={'red'} size={20} />
              )}

              <Text style={ProfileStyles.statusText}>Pan</Text>
            </View>
            <View
              style={[
                ProfileStyles.gstStatusContainer,
                profileDetail?.mainDetail?.get_user_party_detail?.gst_no !==
                  null && {backgroundColor: '#bdf7b0'},
              ]}>
              {profileDetail?.mainDetail?.get_user_party_detail?.gst_no !==
              null ? (
                <FontAwesome name={'check-circle'} color={'green'} size={20} />
              ) : (
                <Entypo name={'circle-with-cross'} color={'red'} size={20} />
              )}
              <Text style={ProfileStyles.statusText}>GST</Text>
            </View>
          </View>
        </View>

        {/* Joined */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Joined:</Text>
          <Text style={styles.infoValue}>
            {getJoinedDateDifference(profileDetail?.mainDetail?.created_at)}
          </Text>
        </View>

        {/* Calling No */}
        {(route.params?.type === 'BidCard' ||
          route.params?.type === 'LoadCard' ||
          route.params?.type === 'LoadDetails') &&
          route.params?.bidDetail?.bid_status !== 'Negotiate_By_Transporter' &&
          route.params?.bidDetail?.bid_status !== 'Pending' &&
          route.params?.bidDetail?.bid_status !== 'Negotiate_By_Shipper' &&
          route.params?.bidDetail?.bid_status !== 'Reject' &&
          route.params?.bidDetail?.bid_status !== 'Payment_Request' &&
          route.params?.bidDetail?.poststatus !== 'Pending' &&
          route.params?.bidDetail?.poststatus !== 'Reject' && (
            <>
              {primaryNumber && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Calling No:</Text>
                  <Pressable
                    onPress={() => Linking.openURL(`tel:+91${primaryNumber}`)}>
                    <Text style={styles.infoValue}>{formattedPrimary}</Text>
                  </Pressable>
                </View>
              )}
              {alternateNumber && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Owner No:</Text>

                  <Pressable
                    onPress={() =>
                      Linking.openURL(`tel:+91${alternateNumber}`)
                    }>
                    <Text style={styles.infoValue}>{formattedAlternate}</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}

        {/* Fleets Owned */}
        <View style={styles.section}>
          {profileDetail?.mainDetail?.role === 2 &&
            profileDetail?.fleetOwned?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Fleets Owned
                  <Text style={styles.countText}>
                    {' '}
                    ({profileDetail?.total_lorries})
                  </Text>
                </Text>

                <View style={styles.fleetRow}>
                  {displayedFleets?.map((fleet, index) => (
                    <View key={index} style={styles.fleetBox}>
                      <Text style={styles.fleetCount}>{fleet.vehicle_cnt}</Text>
                      <Text style={styles.fleetCategory}>
                        {fleet.vehicle_category}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

          {profileDetail?.fleetOwned?.length > 4 && (
            <Pressable onPress={() => setShowAllFleets(!showAllFleets)}>
              <Text style={styles.seeMoreText}>
                {showAllFleets ? '- See Less' : '+ See More'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Handled Materials */}
        {profileDetail?.handledMaterials?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Handled Materials
              <Text style={styles.countText}>
                {' '}
                ({profileDetail?.handledMaterials?.length})
              </Text>
            </Text>
            <View style={styles.tagContainer}>
              {displayedMaterials.map((item, index) => (
                <View key={index} style={styles.tagBlue}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
            {profileDetail?.handledMaterials?.length > 4 && (
              <Pressable onPress={() => setShowAllMaterials(!showAllMaterials)}>
                <Text style={styles.seeMoreText}>
                  {showAllMaterials ? '- See Less' : '+ See More'}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Operating States */}
        {profileDetail?.mainDetail?.get_user_party_detail
          ?.get_party_state_routes?.length > 0 && (
          <View style={[styles.section, {borderBottomWidth: 0}]}>
            <Text style={styles.sectionTitle}>
              Operating States
              <Text style={styles.countText}>
                {' '}
                (
                {
                  profileDetail?.mainDetail?.get_user_party_detail
                    ?.get_party_state_routes?.length
                }
                )
              </Text>
            </Text>
            <View style={styles.tagContainer}>
              {displayedStates.map((item, index) => (
                <View key={index} style={styles.tagGreen}>
                  <Text style={styles.tagText}>
                    {item?.get_selected_party_state?.name || 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
            {profileDetail?.mainDetail?.get_user_party_detail
              ?.get_party_state_routes?.length > 4 && (
              <Pressable onPress={() => setShowAllStates(!showAllStates)}>
                <Text style={styles.seeMoreText}>
                  {showAllStates ? '- See Less' : '+ See More'}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignSelf: 'center',
    backgroundColor: '#dfe7f5',
    width: '100%',
    paddingVertical: verticalScale(20),
  },
  centerAlign: {
    alignSelf: 'center',
  },
  profileName: {
    color: 'black',
    fontSize: moderateScale(20),
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: verticalScale(7),
  },
  profileSubTitle: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: 'black',
  },
  section: {
    marginTop: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    paddingBottom: verticalScale(12),
  },
  sectionTitle: {
    color: 'black',
    fontSize: moderateScale(18),
    fontWeight: '500',
  },
  countText: {
    color: 'black',
    fontSize: moderateScale(14),
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(20),
    gap: scale(20),
    width: '100%',
  },
  historyValue: {
    color: '#203afa',
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  historyLabel: {
    color: 'black',
    fontSize: moderateScale(14),
  },
  infoRow: {
    paddingHorizontal: moderateScale(20),
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
  },
  infoLabel: {
    color: 'black',
    fontSize: moderateScale(13),
  },
  infoValue: {
    fontSize: moderateScale(13),
    color: 'black',
  },
  fleetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    gap: moderateScale(20),
    flexWrap: 'wrap',
  },
  fleetBox: {
    backgroundColor: '#fff',
    height: moderateVerticalScale(60),
    width: '25%',
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(10),
    borderColor: 'grey',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
  },
  fleetCount: {
    color: 'black',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  fleetCategory: {
    color: 'black',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(10),
    marginVertical: verticalScale(10),
  },
  tagBlue: {
    backgroundColor: 'lightblue',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagGreen: {
    backgroundColor: 'lightgreen',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    color: 'black',
    fontSize: moderateScale(13),
    fontWeight: '400',
  },
  seeMoreText: {
    fontSize: moderateScale(13),
    color: '#203afa',
    textAlign: 'left',
    marginTop: verticalScale(5),
  },
});
