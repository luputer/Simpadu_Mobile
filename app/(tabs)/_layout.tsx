import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#088904',
            tabBarStyle: {
                height: 60,
                paddingBottom: 5,
                paddingTop: 5
            },
            tabBarLabelStyle: {
                fontFamily: 'outfit',
                fontSize: 12
            }
        }}>
            <Tabs.Screen name="dashbord" 
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({color, size}) => 
                        <Ionicons name="home-outline" size={size} color={color} />
                }}
            />
            <Tabs.Screen name="employees" 
                options={{
                    title: 'Pegawai',
                    tabBarIcon: ({color, size}) => 
                        <Ionicons name="document-text-outline" size={size} color={color} />
                }}
            />
            <Tabs.Screen name="presensi" 
                options={{
                    title: 'Presensi',
                    tabBarIcon: ({color, size}) => (
                        <View style={{
                            backgroundColor: '#088904',
                            borderRadius: 30,
                            padding: 10,
                            marginBottom: 20,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Ionicons name="qr-code-outline" size={26} color="white" />
                        </View>
                    )
                }}
            />
            <Tabs.Screen name="notification" 
                options={{
                    title: 'Notification',
                    tabBarIcon: ({color, size}) => 
                        <Ionicons name="notifications-outline" size={size} color={color} />
                }}
            />
            <Tabs.Screen name="account" 
                options={{
                    title: 'Account',
                    tabBarIcon: ({color, size}) => 
                        <Ionicons name="person-outline" size={size} color={color} />
                }}
            />
        </Tabs>
    )
}