// mobile/src/screens/ChangelogScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

const changelogData = [
  {
    version: '1.0.0',
    date: '2025-07-07',
    changes: [
      'Initial release of My Belongings Hub.',
      'Core item management features.',
      'AI Diagnostic Tool (basic).',
      'Manual Service & Maintenance Logging.',
      'Initial Technician Search.',
      'Manual Reminders.',
    ],
  },
  {
    version: '1.1.0',
    date: '2025-07-14',
    changes: [
      'Implemented Gamification (XP, Level, Badges, Leaderboard, Good Owner Score).',
      'Added In-app Chat with Technicians.',
      'Introduced Forum functionality.',
      'Implemented Push Notifications.',
      'Added Review system for Technicians.',
      'Implemented Reporting for content moderation.',
    ],
  },
  {
    version: '1.2.0',
    date: '2025-07-21',
    changes: [
      'Implemented Marketplace (Create Listing, View Listings, Buy Now).',
      'Added Order History (Buyer & Seller views).',
      'Introduced Dispute Management.',
      'Implemented Referral Program.',
      'Added In-product NPS Survey.',
      'Implemented Offline Caching for Items.',
      'Integrated Biometric Authentication.',
      'Configured Deep Linking.',
    ],
  },
  // Add more versions as features are added
];

const ChangelogScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Changelog</Text>
        {changelogData.map((versionEntry, index) => (
          <View key={index} style={styles.versionContainer}>
            <Text style={styles.versionHeader}>Version {versionEntry.version} ({versionEntry.date})</Text>
            {
              versionEntry.changes.map((change, changeIndex) => (
                <Text key={changeIndex} style={styles.changeItem}>• {change}</Text>
              ))
            }
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  versionContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  changeItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
    lineHeight: 22,
  },
});

export default ChangelogScreen;
