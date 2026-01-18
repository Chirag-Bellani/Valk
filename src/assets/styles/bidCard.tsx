import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    width: '90%',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  topRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  downlodContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  truckImage: {
    width: 50,
    height: 30,
    marginLeft: 10,
    marginTop: 10,
  },
  vehicleText: {
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
    color: 'black',
  },
  amountContainer: {
    position: 'absolute',
    right: '1%', // Adjust the value as per your needs
  },

  amountText: {
    marginTop: 10,
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'right'
  },
  bidAmountText: {
    fontWeight: '500',
    color: 'black',
    fontSize: 10,
    textAlign: 'right'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right'
  },
  bidderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,

  },
  bidderLogo: {
    width: 30,
    height: 30,
    marginLeft: 12,
    marginTop: 10,
  },
  bidderName: {
    marginLeft: 10,
    marginTop: 10,
    color: '#000',
  },
  actionButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
  },
  actionButton: {
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 5
  },
  buttonText: {
    color: 'white',
  },
  waitingForAcceptanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  waitingForAcceptanceText: {
    color: '#000',
    marginLeft: 10,
  },
  reachedRequestContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  reachedRequestText: {
    color: '#000',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  acceptButtonContainer: {
    backgroundColor: 'green',
    padding: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  rejectButtonContainer: {
    backgroundColor: 'red',
    padding: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  loadedRequestButton: {
    backgroundColor: 'green',
    padding: 7,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 30,
  },
  attachLorryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c5e7eb',
    width: '68%',
    // height: '95%',
    borderRadius: 6,
    flexDirection: 'row',
    padding: 5,
    margin: 6,
  },
  attachLorryText: {
    color: 'blue',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
  },
  requestButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#78f57c',
    marginLeft: 10,
    borderRadius: 6,
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    paddingHorizontal: 12,
  },
  requestButtonText: {
    color: 'blue',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  loadedRequestContainer: {
    alignItems: 'center',
    flexDirection: 'row',

    padding: 5,
  },
  loadedRequestText: {
    color: '#000',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  completionRequestButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#78f57c',
    marginLeft: 10,
    borderRadius: 6,
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    paddingHorizontal: 25,
  },
  completionRequestButtonText: {
    color: 'blue',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  completionMessage: {
    borderColor: 'green',
    borderWidth: 1,
    marginLeft: 8,
    borderRadius: 6,
    flexDirection: 'row',
    padding: 5,
    margin: 5,
    paddingHorizontal: 12,
  },
  completionMessageText: {
    color: 'green',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  swipeButtonContainer: {
    width: '70%',
    // height: 50,
    // marginVertical: 10,
  },
  documentsCard: {
    borderRadius: 12,
    marginTop: 10,
    padding: 16,
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  tabsContainer: {
    marginTop: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tabButton: {
    backgroundColor: '#e2e2e2',
    padding: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  activeTab: {
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  documentsSection: {
    width: '90%',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  itemContainer: {
    padding: 10,
  },
  bankName: {
    fontSize: 16,
    color: '#000'
  },
  accountNo: {
    fontSize: 14,
    color: '#666',
  }
});
