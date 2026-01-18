import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import {ActivityIndicator} from 'react-native-paper';
import NotificationCardSkeleton from '../../skeleton/notificationCardSkeleton';

const Notifiactions = ({navigation}) => {
  const [notificaitonList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationList = async () => {
    try {
      const response = await apiPost(
        API_ENDPOINTS.NOTIFICATION.NOTIFICATION_LIST,
      );

      if (response.success) {
        setNotificationList(response.data);
      } else {
        console.log('Failed to fetch data');
        setNotificationList([]);
      }
      setRefreshing(false);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderNotificationCard = ({item: notificationList}) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('LoadDetails', {
            post_load_id: notificationList.post_load_id,
          })
        }>
        <View style={styles.cardContent}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontWeight: '500',
              marginBottom: 5,
            }}>
            {notificationList.title}
          </Text>
          <Text style={{fontSize: 13, marginBottom: 2, color: 'black'}}>
            {notificationList.body}
          </Text>
        </View>
        <View style={{backgroundColor: '#f0f4fa'}}></View>
      </Pressable>
    );
  };

  useEffect(() => {
    fetchNotificationList();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={() => <NotificationCardSkeleton />}
        />
      </View>
    );
  }
  return (
    <>
      {!loading && notificaitonList.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Data Not Found</Text>
        </View>
      )}
      <FlatList
        data={notificaitonList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderNotificationCard}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchNotificationList}
          />
        }
      />
    </>
  );
};

export default Notifiactions;

const styles = StyleSheet.create({
  card: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },

  cardContent: {
    marginTop: '2%',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    padding: 10,
  },
  noDataContainer: {
    // flex: 1,
    justifyContent: 'center',
    marginTop: '55%',
    zIndex: -2,
  },
  noDataText: {
    alignSelf: 'center',
  },
});
