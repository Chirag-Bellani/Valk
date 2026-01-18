import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

// Sample PartyCard component that renders party details
const PartyCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, marginTop: '5%'}}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {item?.image != '' ? (
              <Image
                source={{
                  uri: item?.image,
                }}
                style={styles.companyLogo}
              />
            ) : (
              <Image
                source={require('../../../assets/images/default_party_logo.webp')}
                style={styles.companyLogo}
              />
            )}
            <Text style={styles.companyName}>{item?.company_name}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address: </Text>
          <Text style={[styles.value, {flexWrap: 'wrap', marginBottom: -5}]}>
            {item?.address || 'No Address'}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>PAN Number: </Text>
            <Text style={styles.value}>{item?.pan_no || '----'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>GST Number: </Text>
            <Text style={styles.value}>{item?.gst_no || '----'}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('EditParty', {partyDetails: item})}
          style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '90%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    // marginVertical: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: '3%',
    paddingBottom: '-1%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingBottom: '2%',
    marginBottom: '1.5%',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 32,
    height: 32,
    marginRight: '10%',
    borderRadius: 20,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: '2%',
    // marginBottom: '1%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: '#aba7a6',
    fontWeight: 'bold',
    flex: 2,
    // textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#203afa',
    width: '20%',
    marginVertical: '2%',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  editText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PartyCard;
