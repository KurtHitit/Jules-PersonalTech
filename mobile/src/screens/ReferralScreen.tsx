// mobile/src/screens/ReferralScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Share, Alert } from 'react-native';
import * as referralService from '../services/referralService';

const ReferralScreen: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        setLoading(true);
        setError(null);
        const code = await referralService.getMyReferralCode();
        setReferralCode(code);
      } catch (e: any) {
        setError(e.message || "Failed to fetch referral code.");
        console.error("Failed to fetch referral code:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralCode();
  }, []);

  const onShare = async () => {
    if (referralCode) {
      try {
        const result = await Share.share({
          message:
            `Join My Belongings Hub using my referral code: ${referralCode}. Manage your items, get diagnostics, and connect with technicians!`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading referral code...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-red-500 text-lg">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="p-4 items-center justify-center flex-1">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Your Referral Code
        </Text>
        {referralCode ? (
          <Text className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            {referralCode}
          </Text>
        ) : (
          <Text className="text-lg text-neutral-500 dark:text-neutral-400 mb-8">
            No referral code assigned yet.
          </Text>
        )}

        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg mb-4"
          onPress={onShare}
          disabled={!referralCode}
        >
          <Text className="text-white font-semibold text-lg">
            Share Your Code
          </Text>
        </TouchableOpacity>

        <Text className="text-base text-neutral-700 dark:text-neutral-300 text-center mt-4">
          Share this code with your friends to earn rewards!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReferralScreen;
