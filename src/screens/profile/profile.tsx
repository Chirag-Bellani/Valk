import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/authContext';
import ProfileBottomModal from './profileBottomModal';
import {showMessage} from 'react-native-flash-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ProfileStyles from '../../assets/styles/profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import {apiPost} from '../../services/apiUtility';
import {useIsFocused} from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';

const ProfilePage = ({navigation, route}) => {
  const {logout} = useContext(AuthContext);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState(0);
  const [userDetail, setUserDetail] = useState({});
  const isFocused = useIsFocused();
  const [pageType, setPageType] = useState(route?.params?.type);
  const [location, setLocation] = useState(
    route?.params?.location?.seletedAddress,
  );
  const [locationLatitude, setlocationLatitude] = useState(
    route?.params?.location?.latitude,
  );
  const [locationLognitude, setLocationLognitude] = useState(
    route?.params?.location?.longitude,
  );

  const [operationgRoute, setOperationgRoute] = useState([]);

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  const fetchUserDetail = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const formData = new FormData();
        formData.append('user_id', parsedUserInfo.id);
        const response = await apiPost(
          API_ENDPOINTS.USER.GET_PROFILE,
          formData,
        );
        if (response.success) {
          const getPartyStateRoutes =
            response.data?.mainDetail?.get_user_party_detail
              ?.get_party_state_routes;
          setOperationgRoute(getPartyStateRoutes);
          setUserDetail(response.data);
          setCompanyName(response.data?.mainDetail?.company_name);
          setProfileName(response.data?.mainDetail?.name);
          setRole(response.data?.mainDetail?.role);
          setLocationLognitude(response.data?.mainDetail?.longitude);
          setlocationLatitude(response.data?.mainDetail?.latitude);
          // await AsyncStorage.setItem('userInfo', JSON.stringify(json.data));
        } else {
          console.log('Failed to fetch user details');
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.type !== '') {
      setPageType(route?.params?.type);
      setLocation(route?.params?.location?.seletedAddress);
      setlocationLatitude(route?.params?.location?.latitude);
      setLocationLognitude(route?.params?.location?.longitude);
    }
  }, [route.params?.type, route.params?.location]);

  useEffect(() => {
    if (pageType === 'confirmLocation') {
      toggleEditModal();
    }
  }, [pageType]);

  const resetFunction = () => {
    setPageType('');
    setLocation('');
    navigation.setParams({type: '', location: ''});
  };

  const updateProfile = async updatedData => {
    let formData = new FormData();
    formData.append('name', updatedData.name);
    formData.append('email', updatedData.email);
    formData.append('mobile_no', updatedData.mobile_no);
    formData.append('gst_no', updatedData.GSTNumber);
    formData.append('user_location', updatedData.userLocation);
    formData.append('calling_no', updatedData.calling_no);
    formData.append('company_name', updatedData.companyName);
    formData.append('selected_state_id', updatedData.selectedRoute);
    formData.append('latitude', locationLatitude);
    formData.append('longitude', locationLognitude);
    if (updatedData.profileImage) {
      formData.append('party_logo', {
        uri: updatedData.profileImage.uri,
        name: 'profile-image.jpg',
        type: 'image/jpeg',
      });
    }

    var API_URL = API_ENDPOINTS.USER.UPDATE_PROFILE;
    try {
      const response = await apiPost(API_URL, formData);
      if (response.success) {
        fetchUserDetail();
        resetFunction();
        showMessage({
          message: 'Profile updated successfully',
          type: 'success',
        });
        toggleEditModal();
      } else {
        showMessage({
          message: 'Failed to update user details',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage({
        message: 'Please try again.',
        type: 'danger',
      });
    } finally {
    }
  };

  return (
    <View style={ProfileStyles.container}>
      <View style={ProfileStyles.header}>
        <Text style={ProfileStyles.headerTitle}>Profile</Text>
      </View>

      <View style={ProfileStyles.profileContainer}>
        <View style={ProfileStyles.imageContainer}>
          {userDetail?.mainDetail?.get_user_party_detail?.party_logo ? (
            <Image
              source={{
                uri: userDetail?.mainDetail?.get_user_party_detail.image_url,
              }}
              style={ProfileStyles.profileImage}
            />
          ) : (
            <Image
              source={require('../../assets/images/profile.png')}
              style={ProfileStyles.profileImage}
            />
          )}
          <Pressable style={ProfileStyles.editIcon} onPress={toggleEditModal}>
            <MaterialIcons name="edit" size={15} color="#ffffff" />
          </Pressable>
        </View>
        <View style={ProfileStyles.profileText}>
          <Text style={ProfileStyles.name} numberOfLines={2}>
            {companyName}
          </Text>
          <Text style={ProfileStyles.description}>
            {profileName} |{' '}
            {role === 1
              ? 'admin'
              : role === 2
              ? 'transporter'
              : role === 4
              ? 'Commission Agent'
              : 'shipper'}
          </Text>
          <View style={{width: '90%'}}>
            <Text style={[ProfileStyles.description]}>
              {userDetail?.mainDetail?.user_location}
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        style={ProfileStyles.verificationContainer}
        onPress={() => navigation.navigate('KYC', {profileData: userDetail})}>
        <View style={ProfileStyles.verificationContainerHeader}>
          <Text style={ProfileStyles.verificationText}>
            {userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1
              ? 'View Details'
              : userDetail?.mainDetail?.get_user_party_detail
                  ?.aadhaar_front_image !== null ||
                userDetail?.mainDetail?.get_user_party_detail?.pan_image !==
                  null
              ? 'Under Verification'
              : 'Complete Your KYC'}
          </Text>
          <MaterialCommunityIcons
            name={'arrow-right-circle'}
            color={'black'}
            size={25}
          />
        </View>
        <View style={ProfileStyles.statusContainer}>
          <View
            style={[
              ProfileStyles.aadhaarStatusContainer,
              userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1
                ? {backgroundColor: '#bdf7b0'}
                : userDetail?.mainDetail?.get_user_party_detail
                    ?.aadhaar_front_image !== null
                ? {backgroundColor: 'orange'}
                : null,
            ]}>
            {userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1 ? (
              <FontAwesome name={'check-circle'} color={'green'} size={20} />
            ) : userDetail?.mainDetail?.get_user_party_detail
                ?.aadhaar_front_image !== null ? (
              <MaterialIcons name={'hourglass-top'} color={'#333'} size={20} />
            ) : (
              <Entypo name={'circle-with-cross'} color={'red'} size={20} />
            )}
            <Text style={ProfileStyles.statusText}>Aadhaar</Text>
          </View>
          <View
            style={[
              ProfileStyles.panStatusContainer,
              userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1
                ? {backgroundColor: '#bdf7b0'}
                : userDetail?.mainDetail?.get_user_party_detail?.pan_image !==
                  null
                ? {backgroundColor: 'orange'}
                : null,
            ]}>
            {userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1 ? (
              <FontAwesome name={'check-circle'} color={'green'} size={20} />
            ) : userDetail?.mainDetail?.get_user_party_detail?.pan_image !==
              null ? (
              <MaterialIcons name={'hourglass-top'} color={'#333'} size={20} />
            ) : (
              <Entypo name={'circle-with-cross'} color={'red'} size={20} />
            )}
            <Text style={ProfileStyles.statusText}>Pan</Text>
          </View>
          <View
            style={[
              ProfileStyles.gstStatusContainer,
              userDetail?.mainDetail?.get_user_party_detail?.gst_no !==
                null && {backgroundColor: '#bdf7b0'},
            ]}>
            {userDetail?.mainDetail?.get_user_party_detail?.gst_no !== null ? (
              <FontAwesome name={'check-circle'} color={'green'} size={20} />
            ) : (
              <Entypo name={'circle-with-cross'} color={'red'} size={20} />
            )}
            <Text style={ProfileStyles.statusText}>GST</Text>
          </View>
        </View>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={ProfileStyles.detailWrapper}>
          <View style={ProfileStyles.menuContainer}>
            <Pressable
              style={ProfileStyles.menuItem}
              onPress={() => navigation.navigate('Notifications')}>
              <MaterialIcons name="notifications" size={24} color="#203afa" />
              <View>
                <Text style={ProfileStyles.menuText}>Notifications</Text>
                <Text style={ProfileStyles.menuSubText}>
                  Manage notifications
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={ProfileStyles.menuItem}
              onPress={() => navigation.navigate('BankDetails')}>
              <FontAwesome6 name="building-columns" size={24} color="#203afa" />
              <View>
                <Text style={ProfileStyles.menuText}>Bank Details</Text>
                <Text style={ProfileStyles.menuSubText}>
                  Manage your bank details
                </Text>
              </View>
            </Pressable>
            {(role === 3 || role === 4) && (
              <Pressable
                style={ProfileStyles.menuItem}
                onPress={() => navigation.navigate('PartyList')}>
                <FontAwesome6 name="users-gear" size={24} color="#203afa" />
                <View>
                  <Text style={ProfileStyles.menuText}>Party List</Text>
                  <Text style={ProfileStyles.menuSubText}>
                    Manage your party list
                  </Text>
                </View>
              </Pressable>
            )}
            <Pressable
              style={ProfileStyles.menuItem}
              onPress={() => navigation.navigate('TermsAndConditions')}>
              <FontAwesome5 name="file-contract" size={24} color="#203afa" />
              <View>
                <Text style={ProfileStyles.menuText}>Terms & Conditions</Text>
                <Text style={ProfileStyles.menuSubText}>
                  Read what you've signed
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={ProfileStyles.menuItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}>
              <MaterialIcons name="security" size={24} color="#203afa" />
              <View>
                <Text style={ProfileStyles.menuText}>Privacy Policy</Text>
                <Text style={ProfileStyles.menuSubText}>
                  Compliance and Regulations
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={ProfileStyles.menuItem}
              onPress={() => navigation.navigate('HelpAndSupport')}>
              <MaterialIcons name="support-agent" size={24} color="#203afa" />
              <View>
                <Text style={ProfileStyles.menuText}>Help & Support</Text>
                <Text style={ProfileStyles.menuSubText}>
                  {/* Compliance and Regulations */}
                  Contact Valk Team For Support
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                ProfileStyles.menuItem,
                {borderBottomWidth: 0, paddingBottom: 15},
              ]}
              onPress={logout}>
              <MaterialIcons name="power-settings-new" size={24} color="red" />
              <View>
                <Text style={[ProfileStyles.menuText, {color: 'red'}]}>
                  Logout
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {isEditModalVisible && (
        <ProfileBottomModal
          isModalVisible={isEditModalVisible}
          toggleModal={toggleEditModal}
          currentUser={userDetail}
          updateProfileData={updateProfile}
          pageType={pageType}
          onLocationPress={() => {
            navigation.navigate('SelectAddress'), toggleEditModal();
          }}
          selectedLocation={location}
          onCanclePress={() => {
            toggleEditModal(), resetFunction();
          }}
        />
      )}
      <Text
        style={{
          fontSize: 15,
          alignSelf: 'center',
          marginBottom: 10,
          color: 'green',
        }}>
        {/* App Version: 1.72 */}
        App Version {VersionCheck.getCurrentVersion()}{' '}
      </Text>
    </View>
  );
};

export default ProfilePage;
