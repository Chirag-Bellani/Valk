import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';


const {width} = Dimensions.get('window');

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View
      // colors={['#4c669f', '#3b5998', '#192f6a']}
      // start={{ x: 1, y: 0 }}
      // end={{ x: 0, y: 1 }}
      style={{
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#203afa',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <Text
              style={{
                color: isFocused ? 'white' : 'darkgrey', // Gold color for active tab
                fontWeight: isFocused ? 'bold' : 'normal',
                textAlign: 'center',
                fontSize: 15,
                paddingVertical: 10,
                textShadowColor: isFocused ? '#000' : 'transparent',
                textShadowOffset: isFocused ? {width: 0, height: 1} : {},
                textShadowRadius: isFocused ? 1 : 0,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
