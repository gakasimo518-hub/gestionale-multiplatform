import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const ClientList: React.FC = () => {
  const navigation = useNavigation();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch('https://your-backend.com/api/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data: Client[] = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredClients(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower)
      )
    );
  }, [search, clients]);

  const deleteClient = async (id: number) => {
    Alert.alert('Delete Client', 'Are you sure you want to delete this client?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await fetch(
              `https://your-backend.com/api/clients/${id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!response.ok) {
              throw new Error('Delete failed');
            }
            setClients((prev) => prev.filter((c) => c.id !== id));
            setFilteredClients((prev) => prev.filter((c) => c.id !== id));
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not delete client.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Client }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>{item.email}</Text>
        <Text style={styles.detail}>{item.phone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ClientForm', { clientId: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteClient(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by name or email"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ClientForm')}
      >
        <Text style={styles.addButtonText}>+ Add Client</Text>
      </TouchableOpacity>
      {filteredClients.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noData}>No clients found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  search: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  detail: { fontSize: 14, color: '#6b7280' },
  actions: { flexDirection: 'row', marginLeft: 8 },
  editButton: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonText: { color: '#fff', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noData: { fontSize: 16, color: '#6b7280' },
});

export default ClientList;