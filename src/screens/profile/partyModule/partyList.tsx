import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import styles from '../../../assets/styles/main'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PartyCard from './partyCard';
import FixedBottom from '../../../components/fixedBottom';
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';
import PartyCardSkeleton from '../../../skeleton/partyCardSkeleton';

const PartyList = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [partyList, setPartyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  const fetchPartyList = async () => {
    try {
      const response = await apiPost(API_ENDPOINTS.SHIPPER_PARTY.GET_SHIPPER_PARTY)

      if (response.success) {
        setPartyList(response.data);
      } else {
        console.log('Failed to fetch data');
        setPartyList([]);
      }


    }
    catch (error) {
      console.log(error.message);
    }
    finally {
      setLoading(false);
      setRefreshing(false)
    }
  };

  useEffect(() => {
    fetchPartyList();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1]}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={() => <PartyCardSkeleton />}
        />
      </View>
    );
  }
  return (
    <>
      {/* <ParyCard /> */}
      {!loading && partyList.length === 0 && (
        <View style={[styles.noDataContainer, { flex: 1 }]}>
          <Text style={styles.noDataText}> Data Not Found</Text>
        </View>
      )}
      {/* {!loading && partyData.length !== 0 && ( */}
      <FlatList
        data={partyList}
        renderItem={({ item }) => <PartyCard item={item} />}
        keyExtractor={item => item.pan_no}
        contentContainerStyle={{ paddingBottom: '10%' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPartyList}
          />
        }
      />
      {/* )} */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FixedBottom>
          <View style={styles.container}>
            <View
              // colors={['#4c669f', '#3b5998', '#192f6a']}
              style={{
                padding: 6,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                elevation: 5,
                paddingRight: 10,
                backgroundColor: '#0032e8',
                marginBottom: '2%'
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddParty')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialIcons
                    name="group-add"
                    size={24}
                    color="#fff"
                    style={{ paddingHorizontal: 12, paddingVertical: 3 }}
                  />
                  <Text style={styles.buttonText}>Add Party</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </FixedBottom>
      </View>
    </>
  );
};

export default PartyList;
