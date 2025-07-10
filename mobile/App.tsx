import React from "react";
import { NativeWindStyleSheet } from "nativewind";
import AppNavigator from "@/navigation/AppNavigator";
import { AuthProvider } from "@/context/AuthContext";
import Toast from "@/components/Toast";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import * as Linking from "expo-linking";

// This is required for NativeWind
NativeWindStyleSheet.setOutput({
  default: "native",
});

const App = () => {
  const prefix = Linking.createURL('/');

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        ItemList: 'items',
        ItemDetail: 'items/:itemId',
        // Add other screens that should be deep linked
      },
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AppNavigator linking={linking} />
          <Toast />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

// Previous content for reference if needed:
// import React from 'react';
//
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
