import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation/types";

type SuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Success"
>;

interface Props {
  navigation: SuccessScreenNavigationProp;
}

const SuccessScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900 justify-center items-center">
      <View className="p-4 items-center">
        <Text className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
          Success!
        </Text>
        <Text className="text-lg text-neutral-800 dark:text-neutral-200 text-center mb-6">
          Your item has been added successfully.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg mb-4"
          onPress={() => navigation.navigate("ItemList")}
        >
          <Text className="text-white font-semibold text-lg">
            View My Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-300 dark:bg-gray-700 py-3 px-6 rounded-lg"
          onPress={() => navigation.navigate("AddItem")}
        >
          <Text className="text-neutral-800 dark:text-neutral-200 font-semibold text-lg">
            Add Another Item
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
