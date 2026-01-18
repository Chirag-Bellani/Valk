import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginatorContainer: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArrow: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#3b5998',
    borderRadius: 25,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
  },
  discription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  tncText: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 10,
    color: '#c0c0c0',
  },
  input: {
    flex: 1, // Use flex to occupy remaining space
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dropdown: {
    marginBottom: -12,
    paddingVertical: '1.2%',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#c0c0c0',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  itemTextStyle: {
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: '2%'
    // marginLeft: 10, // Adjust margin for spacing
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#7D7D7D',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formView: {
    padding: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomMargin: {
    marginBottom: 20,
  },
  icon: {
    color: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputWrapper: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  noDataContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '55%',
    zIndex: -2,
  },
  noDataText: {
    color: 'gray',
    alignSelf: 'center',
    fontSize: 16,
  },
  image: {
    marginBottom: 10,
  },
  imageWithTimestamp: {
    flex: 1,
    marginBottom: 10,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderStyle: 'dashed',
  },
  stepContainer: {
    paddingHorizontal: 10,
  },
  marginBottom: {
    marginBottom: '3%',
  },
  linkText: {
    color: '#203afa',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adjust to place below the image container
    alignSelf: 'flex-end', // Align to the right
  },
  removeBtnText: {
    color: 'red',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dark background for overlay
    paddingBottom: 10,
  },
  modalView: {
    width: '80%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTextArea: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  buttonSubmit: {
    width: '40%',
    paddingVertical: 10,
    backgroundColor: '#28A745', // Green
  },
  buttonCancel: {
    width: '40%',
    paddingVertical: 10,
    backgroundColor: '#DC3545', // Red
  },
  disabledButton: {
    width: '40%',
    backgroundColor: '#C0C0C0', // Set your desired color for the disabled state
    opacity: 0.7, // Adjust the opacity to indicate it's disabled
  },
  listContainer: {
    paddingVertical: 10,
  },
});
