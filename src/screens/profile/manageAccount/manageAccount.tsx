import { View, Text, Pressable, Alert } from 'react-native'
import React, { useContext } from 'react'
import { showMessage } from 'react-native-flash-message';
import { AuthContext } from '../../../context/authContext';
import ProfileStyles from '../../../assets/styles/profile'
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';


const ManageAccount = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const deleteAccount = async () => {
    try {

      const response = await apiPost(API_ENDPOINTS.USER.DELETE_USER)

      if (response.success) {
        await logout()
        showMessage({
          message: response.message,
          type: 'success'
        })

      } else {
        showMessage({
          message: response.message,
          type: 'danger'
        })
        console.log('Failed to delete account');
      }
    }
    catch (error) {
      console.error('Error fetching profile details:', error);
    }
  }

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This action will delete all your information from the app.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: deleteAccount,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={ProfileStyles.detailWrapper}>

      <View style={ProfileStyles.menuContainer}>
        <Pressable style={ProfileStyles.menuItem}>
          {/* <MaterialIcons name="notifications" size={24} color="#203afa" /> */}
          <Pressable onPress={logout}>
            <Text style={ProfileStyles.menuText}>Logout</Text>
            <Text style={ProfileStyles.menuSubText}>Logout from your account</Text>
          </Pressable>
        </Pressable>
        {/* <Pressable style={ProfileStyles.menuItem} onPress={confirmDeleteAccount}>
          <View>
            <Text style={ProfileStyles.menuText}>Delete Account</Text>
            <Text style={ProfileStyles.menuSubText}>Remove your Account from Valk</Text>
          </View>
        </Pressable> */}
      </View>
    </View>
  )
}

export default ManageAccount
