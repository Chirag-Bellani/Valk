import {
  View,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {apiPost} from '../../services/apiUtility';
import {API_ENDPOINTS} from '../../constants/apiEndPoints';
import SliderCardSkeleton from '../../skeleton/sliderSkeleton';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const ImageSlider = () => {
  const [imgActive, setImgActive] = useState(0);
  const [sliderImage, setSliderImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchBannerList = async () => {
    try {
      const response = await apiPost(API_ENDPOINTS.IMAGE.GET_SLIDER_IMAGES);
      if (response.success) {
        setSliderImage(response.data);
      } else {
        console.log('Falied to fetch banner list');
        setSliderImage([]);
      }
    } catch (error) {
      console.log('Error fetching banner images:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerList();
  }, []);

  const onChange = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };

  return (
    <View style={imageSliderStyles.container}>
      <View style={imageSliderStyles.wrap}>
        <ScrollView
          onScroll={({nativeEvent}) => {
            onChange(nativeEvent);
          }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={imageSliderStyles.scrollView}>
          {sliderImage.map((data, index) => (
            <Image
              key={index}
              // resizeMode="cover"
              style={imageSliderStyles.wrap}
              source={{uri: data?.image}}
            />
          ))}
        </ScrollView>
        <View style={imageSliderStyles.wrapDot}>
          {sliderImage.map((e, index) => (
            <View
              key={index}
              style={[
                imageSliderStyles.dot,
                imgActive === index ? imageSliderStyles.dotActive : null,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const imageSliderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '3%',
  },
  wrap: {
    width: WIDTH * 0.94,
    height: HEIGHT * 0.28,
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  wrapDot: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dotActive: {
    width: 16,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#253bfa',
    marginHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 6,
  },
});

export default React.memo(ImageSlider);
