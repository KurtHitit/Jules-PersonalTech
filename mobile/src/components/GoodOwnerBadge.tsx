// mobile/src/components/GoodOwnerBadge.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface GoodOwnerBadgeProps {
  score: number;
}

const GoodOwnerBadge: React.FC<GoodOwnerBadgeProps> = ({ score }) => {
  let badgeText = '';
  let badgeColor = '';
  let badgeIcon = '';

  if (score >= 1000) {
    badgeText = 'Master Owner';
    badgeColor = '#4CAF50'; // Green
    badgeIcon = 'https://example.com/master_owner_icon.png'; // Placeholder
  } else if (score >= 500) {
    badgeText = 'Advanced Owner';
    badgeColor = '#2196F3'; // Blue
    badgeIcon = 'https://example.com/advanced_owner_icon.png'; // Placeholder
  } else if (score >= 100) {
    badgeText = 'Good Owner';
    badgeColor = '#FFC107'; // Amber
    badgeIcon = 'https://example.com/good_owner_icon.png'; // Placeholder
  } else {
    badgeText = 'New Owner';
    badgeColor = '#9E9E9E'; // Grey
    badgeIcon = 'https://example.com/new_owner_icon.png'; // Placeholder
  }

  return (
    <View style={[styles.container, { backgroundColor: badgeColor }]}>
      {badgeIcon && <Image source={{ uri: badgeIcon }} style={styles.icon} />}
      <Text style={styles.text}>{badgeText}</Text>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  score: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default GoodOwnerBadge;
