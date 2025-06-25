import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';

// This is required for NativeWind to work
NativeWindStyleSheet.setOutput({
  default: 'native',
});

import AppNavigator from '@/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

export default App;

// Previous content for reference if needed:
// import React from 'react';
// import { SafeAreaView, StatusBar, Text, View } from 'react-native';
// import { NativeWindStyleSheet } from 'nativewind';

// NativeWindStyleSheet.setOutput({
//   default: 'native',
// });

// const App = () => {
//   return (
//     <SafeAreaView className="flex-1">
//       <StatusBar barStyle={'dark-content'} />
//       <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
//         <Text className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
//           My Belongings Hub
//         </Text>
//         <Text className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
//           Coming Soon!
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };
