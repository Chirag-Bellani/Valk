import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WIDTH = Dimensions.get('window').width;

const LatestPostLoadCard = ({item, navigation, role}) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('LoadDetails', {post_load_id: item?.id})
      }
      style={styles.card}>
      <View
        // colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>Latest Post Loads Details</Text>
      </View>
      <View style={styles.cargoSection}>
        <Image
          source={require('../../assets/images/package.png')}
          style={styles.cargoImage}
        />
        <Text style={styles.cargoText}>{item?.get_cargo?.cargo}</Text>
      </View>
      <View style={styles.locationsSection}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" color={'green'} size={17} />
          <Text style={styles.locationText} numberOfLines={2}>
            {/* {'Mundra,\nGujarat'} */}
            {item?.from_location}
          </Text>
        </View>
        <Entypo
          name="arrow-right"
          size={24}
          color="black"
          style={{marginRight: 20}}
        />
        <View style={styles.location}>
          <Ionicons name="location-sharp" color={'red'} size={17} />
          <Text style={styles.locationText} numberOfLines={2}>
            {item?.to_location}
          </Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.detailsText}>
          {item?.qty} {item?.unit}.{' '}
          <MaterialCommunityIcons name="truck" size={17} color={'grey'} /> 30.00{' '}
          {item?.unit} {item?.get_vehicle_category?.vehicle_category}
        </Text>
      </View>

      {(role === 3 || role === 4) && (
        <Pressable
          style={({pressed}) => [styles.repostButton]}
          onPress={() => navigation.navigate('RepostLoad', {loadDetail: item})}>
          <Text style={styles.repostButtonText}>Repost</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: WIDTH * 0.9,
    height: 180,
    marginHorizontal: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginTop: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#0032e8',
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  cargoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cargoImage: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  cargoText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsSection: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  detailsText: {
    fontSize: 13,
    color: '#000',
    // textAlign: 'center',
  },
  locationsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '40%', // Adjust the maxWidth for each location to ensure proper space distribution
  },
  locationText: {
    fontSize: 12,
    marginLeft: '2.5%',
    color: '#000',
    flexShrink: 1, // Allow text to shrink to fit
    flexWrap: 'wrap', // Allow text to wrap to the next line
    maxWidth: '90%', // Ensure the text wraps within its container
  },
  repostButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    paddingVertical: 8,
    borderRadius: 10,
    // borderBottomLeftRadius: 10,
    flexDirection: 'row',
  },
  repostButtonText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default React.memo(LatestPostLoadCard);
