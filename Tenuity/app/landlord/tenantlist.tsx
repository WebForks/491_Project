import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../utils/supabase';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSidebar } from './_layout';

type Tenant = {
  id: number;
  user_id: string;
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
      // Get current landlord user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        setLoading(false);
        return;
      }

      // Only fetch tenants tied to this landlord
      const { data, error } = await supabase
        .from('Tenants')
        .select('*')
        .eq('landlord_id', user.id);

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
    <View style={{ flex: 1, backgroundColor: '#f0f2f8' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#fff',
          paddingTop: 50,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: '#ddd',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={toggleSidebar}>
            <Entypo name="menu" size={30} color="black" />
          </TouchableOpacity>
          <Link href="/landlord/dashboard" asChild>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 120, height: 80 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Link>
          <Link href="/landlord/profile-landlord" asChild>
            <TouchableOpacity>
              <AntDesign name="user" size={28} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Tenant List */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#5C4DFF" />
        ) : tenants.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 16, color: '#555' }}>
            No tenants found.
          </Text>
        ) : (
          tenants.map((tenant) => (
            <View
              key={tenant.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 16,
                marginBottom: 14,
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 3,
              }}
            >
              <Image
                source={{
                  uri:
                    tenant.profile_pic_path ||
                    'https://i.pravatar.cc/150?u=default',
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  marginRight: 14,
                }}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 2,
                    color: '#222',
                  }}
                >
                  {tenant.first_name} {tenant.last_name}
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>{tenant.email}</Text>
                <Text style={{ fontSize: 14, color: '#555' }}>
                  Phone: {tenant.phone_number}
                </Text>
              </View>
              <Link
                href={{
                  pathname: '/landlord/landlordChat',
                  params: { chatId: tenant.user_id },
                }}
                asChild
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: '#5C4DFF',
                    padding: 10,
                    borderRadius: 50,
                    marginLeft: 10,
                    shadowColor: '#5C4DFF',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                  }}
                >
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
