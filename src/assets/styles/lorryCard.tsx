import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
export default styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '93%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop:verticalScale(10)
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckImage: {
    width: 60,
    height: 30,
    marginRight: 10,
  },
  vehicleNo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
  },
  truckType: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    color: '#555',
  },
  vehicleCapacity: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
 
  locationContainer: {
    flex: 4,
  },
  locationText: {
    fontSize: 13,
    color: 'black',
  },
  toggleText: {
    color: '#007bff',
    // marginLeft: 5,
    marginRight:10
  },
  placeBidButton: {
    backgroundColor: '#203afa',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'flex-end'
  },
  placeBidButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
