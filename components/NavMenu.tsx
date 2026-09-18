import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNavigate } from 'react-router-dom';
import { tw } from 'nativewind';

interface MenuItem {
  label: string;
  route: string;
}

interface NavMenuProps {
  items: MenuItem[];
}

const NavMenu: React.FC<NavMenuProps> = ({ items }) => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const handlePress = (route: string) => {
    if (Platform.OS === 'web') {
      navigate(route);
    } else {
      // @ts-ignore
      navigation.navigate(route);
    }
  };

  return (
    <View style={tw`flex flex-col space-y-2 p-4 bg-gray-800 text-white`}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => handlePress(item.route)}
          style={tw`py-2 px-4 rounded hover:bg-gray-700`}
        >
          <Text style={tw`text-lg`}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavMenu;