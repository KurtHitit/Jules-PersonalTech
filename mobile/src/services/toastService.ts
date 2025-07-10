// mobile/src/services/toastService.ts
import { Emitter } from 'react-native-ui-lib';

export const showToast = (message: string) => {
  Emitter.emit('showToast', { message });
};
