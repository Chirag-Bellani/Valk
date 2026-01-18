import {View, Text, Alert} from 'react-native';
import EasebuzzCheckout from 'react-native-easebuzz-kit';
import {showMessage} from 'react-native-flash-message';

// Function to set the message type dynamically
const paymentStatus = status => {
  let status_msg = '';
  let status_type = '';

  switch (status) {
    case 'payment_successfull':
      status_msg = 'Payment successful!';
      status_type = 'success';
      break;
    case 'payment_failed':
      status_msg = 'Payment failed!';
      status_type = 'danger';
      break;
    case 'txn_session_timeout':
      status_msg = 'Transaction session timeout.';
      status_type = 'danger';
      break;
    case 'back_pressed':
    case 'user_cancelled':
      status_msg = 'Payment cancelled by user.';
      status_type = 'warning';
      break;
    case 'error_server_error':
      status_msg = 'Server not responding.';
      status_type = 'danger';
      break;
    case 'error_noretry':
      status_msg = 'Payment cancelled.';
      status_type = 'danger';
      break;
    case 'invalid_input_data':
      status_msg = 'Invalid data provided.';
      status_type = 'danger';
      break;
    case 'trxn_not_allowed':
      status_msg = 'Transaction not allowed.';
      status_type = 'danger';
      break;
    case 'retry_fail_error':
      status_msg = 'Retry failed. Please try again.';
      status_type = 'danger';
      break;
    case 'bank_back_pressed':
      status_msg = 'Transaction rejected by bank.';
      status_type = 'danger';
      break;
    default:
      status_msg = 'An unknown error occurred.';
      status_type = 'danger';
      break;
  }

  showMessage({
    message: status_msg,
    type: status_type,
  });
};

export const callPaymentGateway = async bidId => {
  const formData = new FormData();
  formData.append('bid_id', bidId);
  console.log('Form Data:', formData);

  try {
    const response = await fetch(
      'https://valkservices.in/public/api/payment-gateway-initiate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        body: formData,
      },
    );

    const json = await response.json();
    const access_key = json?.data;

    if (!access_key) {
      throw new Error('Access key not found in the response.');
    }

    const options = {
      access_key, // Access key from your backend
      pay_mode: 'production', // 'test'or 'production'
    };

    return new Promise((resolve, reject) => {
      EasebuzzCheckout.open(options)
        .then(data => {
          // console.log(JSON.stringify(data.payment_response))
          const paymentStatusKey = data?.result;
          // console.log(paymentStatusKey)
          if (paymentStatusKey) {
            resolve(data);
            paymentStatus(paymentStatusKey);
          } else {
            showMessage({
              message: 'Payment response status not found.',
              type: 'danger',
            });
          }
        })
        .catch(error => {
          console.error('SDK Error:', error);
          reject(error);
          showMessage({
            message: error.message || 'Payment SDK error occurred.',
            type: 'danger',
          });
        });
    });
  } catch (error) {
    console.error('Backend Error:', error);
    Alert.alert('Error', 'Failed to generate access key.');
  }
};
