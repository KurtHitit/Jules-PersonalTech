// mobile/src/services/biometricService.ts
import * as LocalAuthentication from 'expo-local-authentication';

export const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

export const authenticateWithBiometrics = async (): Promise<LocalAuthentication.AuthenticateResult> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access My Belongings Hub',
    fallbackLabel: 'Enter Passcode',
  });
  return result;
};
