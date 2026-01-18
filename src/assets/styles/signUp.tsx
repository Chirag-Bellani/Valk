import {StyleSheet} from 'react-native';

export default style = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    marginVertical: 7,
    width: '100%',
  },
  locationInputWrapper: {
    marginVertical: 7,
    width: '100%',
    position: 'relative', // 👈 Add this
    zIndex: 10, // 👈 Optional, but helps on Android
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  radioContainer: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    padding: 5,
  },
  radioLabel: {
    color: '#fff',
    marginLeft: 3,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    alignSelf: 'flex-start',
    paddingTop: 3,
  },
});
