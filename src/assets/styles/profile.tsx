import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#2196F3', // Blue border
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  buttonText: {
    fontSize: 16,
    color: '#2196F3', // Blue text
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  item: {
    // backgroundColor: '#E0F7FA', // Light cyan background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: '#B2EBF2', // Slightly darker cyan border
  },
  itemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B', // Dark teal color
    marginBottom: 5,
    textAlign: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#00796B', // Dark teal color
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#203afa',
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 140,
    padding: 10,
    paddingVertical: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 7,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#203afa',
    borderRadius: 50,
    padding: 5,
  },
  profileText: {
    marginLeft: 10,
    width: '75%',
  },
  name: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    flexShrink: 1
  },
  description: {
    color: 'grey',
    flexShrink: 1,
  },
  detailWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
  },
  menuSubText: {
    fontSize: 13,
    color: 'grey',
    marginLeft: 10,
    flexShrink: 1,
  },
  verificationContainer: {
    paddingHorizontal: 12,
    marginVertical: 12,
    marginHorizontal: 12,
    width: '93%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10
  },
  verificationContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  verificationText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black'
  },
  statusContainer: {
    marginTop: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  aadhaarStatusContainer: {
    backgroundColor: '#f28b83',
    padding: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4

  },
  panStatusContainer: {
    backgroundColor: '#f28b83',
    padding: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4

  },
  gstStatusContainer: {
    backgroundColor: '#f28b83',
    padding: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  statusText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 13
  },
  operateRootContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
  },
  routeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  routeItem: {
    backgroundColor: '#ffefcc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllButton: {
    padding: 5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
