import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface NavLink {
  label: string;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  links?: NavLink[];
  style?: object;
}

const Header: React.FC<HeaderProps> = ({ title, links = [], style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.nav}>
        {links.map((link, index) => (
          <TouchableOpacity
            key={index}
            onPress={link.onPress}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  nav: {
    flexDirection: 'row',
  },
  navItem: {
    marginLeft: 16,
  },
  navText: {
    fontSize: 16,
    color: '#0066cc',
  },
});

export default Header;