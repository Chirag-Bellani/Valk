import { View, Text, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import RenderHtml from 'react-native-webview';
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';

const PrivacyPolicy = () => {

  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const getTandCData = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');

        const formData = new FormData();
        formData.append('type', 'Privacy Policy');


        const response = await apiPost(API_ENDPOINTS.STATIC_CONTENT.GET_STATIC_CONTENT_BY_TYPE, formData);



        if (response.success && response.data) {
          const styledHtml = `
            <html>
              <head>
                <style>
                  body {
                    font-size: 18px; /* Adjust the font size here */
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 10px;
                    padding:10px;
                    
                  }
                  h1, h2, h3, h4, h5, h6 {
                    color: #203afa;
                    font-size:35px;
                    padding:10px;
                  }
                  p {
                    margin-bottom: 10px;
                    font-size:30px;
                    padding:10px;
                    
                  }
                  ol, ul {
                    margin-left: 20px;
                    font-size:30px;
                  }
                </style>
              </head>
              <body>
                ${response.data.content}
              </body>
            </html>
          `;

          setPrivacyContent(styledHtml);// Set the HTML content in the state
        } else {
          showMessage({
            message: 'Failed to fetch Terms and Conditions',
            type: 'danger',
          });
        }
      } catch (error) {
        console.error('Error fetching Terms and Conditions:', error);
        showMessage({
          message: 'An error occurred while fetching Terms and Conditions',
          type: 'danger',
        });
      } finally {
        setLoading(false);
      }
    };

    getTandCData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#203afa" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RenderHtml
        // originWhitelist={['*']}
        source={{ html: privacyContent }}
        contentWidth={width}

      />
    </View>
  )
}

export default PrivacyPolicy
