import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FindLoadList from './findLoadList';
import CustomTabBar from '../../components/tabBarcomponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';


const FindLoadHome = () => {
    const Topbar = createMaterialTopTabNavigator();

    return (
        <>
            <Topbar.Navigator
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: 'transparent',
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'grey',
                    tabBarLabelStyle: {
                        fontSize: 15,
                        padding: 3,
                        fontWeight: '600',
                        textTransform: 'capitalize',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: 'blue',
                        height: 2,
                    },
                }}
            >
                <Topbar.Screen
                    name="FindLoadList"
                    component={FindLoadList}
                    options={{ title: "Find Load List" }}
                    initialParams={{ status: 'FindLoad' }}
                />
                <Topbar.Screen
                    name="MyBid"
                    component={FindLoadList}
                    options={{ title: "My Bid" }}
                    initialParams={{ status: 'MyBid' }}
                />
            </Topbar.Navigator>
        </>
    );
};

export default FindLoadHome;
