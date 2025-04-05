import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../utils/supabase';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSidebar } from './_layout';

type Tenant = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_pic_path?: string;
};

export default function TenantListScreen() {
  const { toggleSidebar } = useSidebar();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      const { data, error } = await supabase.from('Tenants').select('*');
      if (error) {
        console.error('Error fetching tenants:', error.message);
      } else {
        setTenants(data as Tenant[]);
      }
      setLoading(false);
    };

    fetchTenants();
  }, []);

  return (
    <View className="flex-1 bg-white pt-10">
      {/* Top Nav Bar */}
      <View className="flex-row justify-between items-center px-4 mb-4">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="/landlord/dashboard" asChild>
          <TouchableOpacity>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Link>
        <Link href="/landlord/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={30} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Tenant List */}
      <ScrollView className="p-4 bg-gray-100">
        {loading ? (
          <ActivityIndicator size="large" color="#3ab7ff" />
        ) : tenants.length === 0 ? (
          <Text className="text-center text-lg text-gray-700">No tenants found.</Text>
        ) : (
          tenants.map((tenant) => (
            <View
              key={tenant.id}
              className="mb-4 p-4 bg-white rounded-xl shadow border border-gray-300 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: tenant.profile_pic_path || 'https://i.pravatar.cc/150?u=default',
                  }}
                  style={{ width: 60, height: 60, borderRadius: 9999, marginRight: 12 }}
                  resizeMode="cover"
                />
                <View>
                  <Text className="text-lg font-bold">
                    {tenant.first_name} {tenant.last_name}
                  </Text>
                  <Text className="text-sm text-gray-600">{tenant.email}</Text>
                  <Text className="text-sm text-gray-600">
                    Phone: {tenant.phone_number}
                  </Text>
                </View>
              </View>

              <Link
                href={{ pathname: '/landlord/chat', params: { chatId: tenant.id.toString() } }}
                asChild
              >
                <TouchableOpacity className="p-2 bg-blue-500 rounded-full ml-2">
                  <MaterialIcons name="message" size={22} color="white" />
                </TouchableOpacity>
              </Link>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
