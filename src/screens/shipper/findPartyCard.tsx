import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import KycModal from '../../components/kycModal';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const PartyCard = ({item, navigation, userDetail}) => {
  const [visibleModal, setVisibleModal] = useState(null);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);

  const renderTags = (data, modalKey) => {
    return (
      <View style={styles.tagContainer}>
        {data?.slice(0, 2).map(item => (
          <View key={item?.id} style={styles.tag}>
            <Text style={styles.tagText}>
              {modalKey === 'vehicle'
                ? item?.vehicle_category
                : modalKey === 'material'
                ? item
                : modalKey === 'route'
                ? item?.get_selected_party_state?.name
                : ''}
            </Text>
          </View>
        ))}
        {data?.length > 2 && (
          <TouchableOpacity onPress={() => setVisibleModal(modalKey)}>
            <View style={styles.moreTag}>
              <Text style={styles.tagText}>+{data?.length - 2} more</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderModal = (data, title, key) => {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={visibleModal === key}
        onRequestClose={() => setVisibleModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setVisibleModal(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalTagList}
              showsVerticalScrollIndicator={false}>
              {data?.map(item => (
                <View key={item?.id} style={styles.modalTag}>
                  <Text style={styles.modalTagText}>
                    {key === 'vehicle'
                      ? item?.vehicle_category
                      : key === 'material'
                      ? item
                      : key === 'route'
                      ? item?.get_selected_party_state?.name
                      : ''}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const imageUrl = item?.mainDetail?.get_user_party_detail?.image_url
    ? item?.mainDetail?.get_user_party_detail?.image_url
    : null;

  return (
    <>
      <View style={styles.cardContainer}>
        {/* Header with avatar, info and bid button */}
        <View style={styles.header}>
          <Image
            source={
              imageUrl
                ? {uri: imageUrl}
                : require('../../assets/images/profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={styles.name}
                onPress={() => {
                  navigation.navigate('UserProfile', {
                    userId: item?.mainDetail?.id,
                  });
                }}>
                {item?.mainDetail?.company_name}
              </Text>
              {/* {item?.mainDetail?.get_user_party_detail?.is_kyc === 1 && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={22}
                  color="green"
                />
              )} */}
            </View>
            <Text style={styles.location}>
              {item?.mainDetail?.user_location}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bidButtonSmall}
            onPress={() => {
              userDetail?.mainDetail?.get_user_party_detail?.is_kyc === 1
                ? navigation.navigate('AddLoad', {
                    party_id: item?.mainDetail?.id,
                  })
                : setIsKycModalVisible(true);
            }}>
            <Text style={styles.bidButtonText}>Place Bid</Text>
          </TouchableOpacity>
        </View>

        {/* Routes */}
        {/* {item?.mainDetail?.get_user_party_detail?.get_party_state_routes?.length > 0 && (
                    <>
                        <View style={styles.rowContainer}>
                            <Text style={styles.sectionTitle}>Operating States</Text>
                        </View>
                        {renderTags(item.mainDetail.get_user_party_detail.get_party_state_routes, 'route')}
                    </>
                )} */}

        {/* Materials */}
        {/* {item?.handledMaterials?.length > 0 &&
                    <>
                        <View style={styles.rowContainer}>
                            <Text style={styles.sectionTitle}>Operating Material</Text>
                        </View>
                        {renderTags(item?.handledMaterials, 'material')}
                    </>
                } */}

        {/* Vehicles */}
        {item?.fleetOwned?.length > 0 && (
          <>
            <View style={styles.rowContainer}>
              <Text style={styles.sectionTitle}>Owned Fleets</Text>
            </View>
            {renderTags(item?.fleetOwned, 'vehicle')}
          </>
        )}
      </View>

      {/* Modals */}
      {/* {renderModal(item?.mainDetail?.get_user_party_detail?.get_party_state_routes, 'All Operating Routes', 'route')}
            {renderModal(item?.handledMaterials, 'All Handling Materials', 'material')} */}
      {renderModal(item?.fleetOwned, 'All Owned Vehicles', 'vehicle')}
      <KycModal
        isVisible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
        userDetail={userDetail}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: scale(10),
    borderRadius: scale(16),
    backgroundColor: '#fff',
    padding: scale(10),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: verticalScale(2)},
    shadowOpacity: 0.08,
    shadowRadius: scale(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(28),
    marginRight: scale(7),
    borderWidth: 1,
    borderColor: '#eee',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: '#222',
  },
  location: {
    fontSize: moderateScale(11),
    color: '#222',
    marginRight: moderateScale(5),
  },
  vehicles: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: verticalScale(2),
  },
  bidButtonSmall: {
    backgroundColor: '#2563EB',
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(10),
    borderRadius: scale(18),
    elevation: 2,
  },
  bidButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#444',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(4),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(6),
  },
  tag: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(10),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moreTag: {
    backgroundColor: '#D1FAE5',
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(10),
    borderRadius: scale(14),
  },
  tagText: {
    fontSize: moderateScale(12),
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopRightRadius: scale(24),
    borderTopLeftRadius: scale(24),
    padding: scale(24),
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: '#111',
  },
  modalCloseText: {
    fontSize: moderateScale(18),
    color: '#888',
  },
  modalTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  modalTag: {
    backgroundColor: '#F3F4F6',
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(10),
    borderRadius: scale(20),
  },
  modalTagText: {
    fontSize: moderateScale(15),
    color: '#333',
  },
});

export default PartyCard;
