import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },

  formContainer: {
    marginTop: '5%',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: '2%',
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderColor: '#000',
    color: '#333',
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#7D7D7D',
  },
  inputWrapper: {
    marginVertical: '1.5%',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginVertical: '5%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
  },
  addImageIcon: {
    position: 'absolute',
    top: 70,
    right: 135,
    backgroundColor: '#203afa',
    borderRadius: 15,
    padding: 7,
    zIndex: 7,
  },
  imageWrapper: {
    position: 'relative',
  },
  errorLabel: {
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#203afa',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: '7%',
  },
  submitText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#C0C0C0',
    opacity: 0.7,
  },
});
