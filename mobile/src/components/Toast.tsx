// mobile/src/components/Toast.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Emitter } from 'react-native-ui-lib';

const Toast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const subscription = Emitter.on('showToast', ({ message }) => {
      setMessage(message);
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' }}>
      <View style={{ backgroundColor: 'black', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>{message}</Text>
      </View>
    </View>
  );
};

export default Toast;
