import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { s } from "react-native-wind"
import { StatusBar } from 'expo-status-bar'

export default function Notification() {
  return (
    <View style={s`flex-1 bg-white`}>
      <StatusBar hidden={true} />
      {/* Header */}
      <View style={[s`p-4 rounded-b-3xl`, { backgroundColor: '#088904' }]}>
        <Text style={s`text-white text-2xl font-bold text-center mt-8`}>
          Notification
        </Text>
      </View>

      <ScrollView style={s`flex-1 px-4`}>
        {/* Today Section */}
        <Text style={s`text-gray-600 mt-4 mb-2`}>Today</Text>
        
        {/* Yellow Message */}
        <View style={s`bg-yellow-100 p-4 rounded-xl mb-3 flex-row items-start`}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#088904" />
          <View style={s`flex-1 ml-3`}>
            <Text style={s`font-semibold`}>You have 1 message!</Text>
            <Text style={s`text-gray-600 text-sm mt-1`}>
              Kamu belum melakukan input pegawai, harap input secepatnya agar pegawai baru dapat melakukan validasi
            </Text>
            <Text style={s`text-gray-500 text-xs mt-2 text-right`}>10:00</Text>
          </View>
        </View>

        {/* Blue Message */}
        <View style={s`bg-blue-100 p-4 rounded-xl mb-3 flex-row items-start`}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#088904" />
          <View style={s`flex-1 ml-3`}>
            <Text style={s`font-semibold`}>You have 1 message!</Text>
            <Text style={s`text-gray-600 text-sm mt-1`}>
              Kamu belum melakukan melakukan presensi harian, harap segera presensi agar tidak mendapat surat peringatan
            </Text>
            <Text style={s`text-gray-500 text-xs mt-2 text-right`}>08:05</Text>
          </View>
        </View>

        {/* Yesterday Section */}
        <Text style={s`text-gray-600 mt-4 mb-2`}>Yesterday</Text>

        {/* More Blue Messages */}
        <View style={s`bg-blue-100 p-4 rounded-xl mb-3 flex-row items-start`}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#088904" />
          <View style={s`flex-1 ml-3`}>
            <Text style={s`font-semibold`}>You have 1 message!</Text>
            <Text style={s`text-gray-600 text-sm mt-1`}>
              Kamu belum melakukan input pegawai, harap input secepatnya agar pegawai baru dapat melakukan validasi
            </Text>
            <Text style={s`text-gray-500 text-xs mt-2 text-right`}>12:00</Text>
          </View>
        </View>

        <View style={s`bg-blue-100 p-4 rounded-xl mb-3 flex-row items-start`}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#088904" />
          <View style={s`flex-1 ml-3`}>
            <Text style={s`font-semibold`}>You have 1 message!</Text>
            <Text style={s`text-gray-600 text-sm mt-1`}>
              Kamu belum melakukan melakukan presensi harian, harap segera presensi agar tidak mendapat surat peringatan
            </Text>
            <Text style={s`text-gray-500 text-xs mt-2 text-right`}>08:05</Text>
          </View>
        </View>

        <View style={s`bg-yellow-100 p-4 rounded-xl mb-3 flex-row items-start`}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#088904" />
          <View style={s`flex-1 ml-3`}>
            <Text style={s`font-semibold`}>You have 1 message!</Text>
            <Text style={s`text-gray-600 text-sm mt-1`}>
              Ada pegawai yang meminta izin mendapat profil pribadi, Cek akses untuk memfasilitasi
            </Text>
            <Text style={s`text-gray-500 text-xs mt-2 text-right`}>04:44</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}