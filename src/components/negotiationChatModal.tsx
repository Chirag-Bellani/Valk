import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../services/apiUtility';
import { API_ENDPOINTS } from '../constants/apiEndPoints';


const NegotiationChatModal = ({ isModalVisible, toggleModal, loadData, bidStatus, type }) => {

  const [bidNegotiationChat, setBidNegotiationChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userID, setUserID] = useState(null);

  const fetchNegotiationChat = async () => {

    const userInfo = await AsyncStorage.getItem('userInfo');
    const user_id = JSON.parse(userInfo).id;
    setCurrentUserId(user_id);

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('post_load_id', loadData.post_load_id);
    formData.append('bid_id', loadData.id);

    try {
      const response = await apiPost(API_ENDPOINTS.NEGOTIATE.SHOW_BID_NEGOTIATION_CHAT, formData)
      if (response.success === true) {
        setBidNegotiationChat(response.data.bidHistoryData);

      } else {
        setBidNegotiationChat([]);

      }

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const loginUserDetails = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const user_id = JSON.parse(userInfo).id;
    setUserID('usrid', user_id);
  }


  useEffect(() => {
    loginUserDetails();
    fetchNegotiationChat();
  }, []);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}>

      <View style={styles.modalContainer}>

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate Negotiation</Text>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <MaterialCommunityIcons
                name="close-box"
                size={25}
                color={'blue'}
              />
            </TouchableOpacity>
          </View>
          {
            loading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#203afa" />
              </View>

            )}
          {/* Chat Messages */}
          <ScrollView
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}>
            {bidNegotiationChat.map((chat, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  chat.receiver_id === currentUserId
                    ? styles.senderMessage
                    : styles.receiverMessage,
                ]}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {chat.receiver_id === currentUserId ? (
                    <>
                      <Image
                        source={{ uri: chat.get_sender_data.image_url }}
                        style={{ width: 35, height: 35 }}
                      />
                      <View>
                        <Text style={{ color: 'black' }}>
                          {(chat.receiver_id === userID || (bidStatus === 'Pending' || bidStatus === 'Negotiate_By_Shipper' || bidStatus === 'Negotiate_By_Transporter')) ? chat.get_sender_data.sender : chat.get_sender_data.sender}
                          {/* {chat.get_sender_data.sender} */}
                          {/* Sender */}
                        </Text>
                        <Text style={{ fontSize: 13, color: "black" }}>
                          {new Date(chat.created_at).toLocaleString()}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View >
                        <Text style={{ color: 'black' }}>
                          {(chat.receiver_id === userID && (bidStatus === 'Pending' || bidStatus === 'Negotiate_By_Shipper' || bidStatus === 'Negotiate_By_Transporter')) ? helperRandomMaskString(chat.get_sender_data.sender) : chat.get_sender_data.sender}
                          {/* Receiver */}
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          {new Date(chat.created_at).toLocaleString()}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: chat.get_sender_data.image_url }}
                        style={{ width: 35, height: 35 }}
                      />
                    </>
                  )}
                </View>
                <View
                  style={[
                    chat.receiver_id === currentUserId
                      ? styles.senderText
                      : styles.receiverText,
                  ]}>
                  <Text style={{ fontSize: 15, color: "black" }}>₹{chat.amount}</Text>
                  <Text style={{ fontSize: 13, color: "black" }}>{chat.remarks}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  chatContainer: {
    maxHeight: 700,
    marginTop: 10,
  },
  messageBubble: {
    width: '50%',
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  senderMessage: {
    alignSelf: 'flex-start',
    // flexDirection: 'row',
  },
  receiverMessage: {
    alignSelf: 'flex-end',
    marginRight: 3,
    // flexDirection: 'row-reverse',
  },
  senderText: {
    backgroundColor: '#f0f0f0',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    width: '100%',
  },
  receiverText: {
    backgroundColor: '#f0f0f0',
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'flex-end',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 15,
    color: '#2e73f2',
  },
});

export default NegotiationChatModal;
