import { registerAs } from '@nestjs/config';

const getPrivateKey = () => {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  }
  const parts = [
    process.env.FIREBASE_PRIVATE_KEY_1,
    process.env.FIREBASE_PRIVATE_KEY_2,
    process.env.FIREBASE_PRIVATE_KEY_3,
    process.env.FIREBASE_PRIVATE_KEY_4,
  ];
  const combined = parts.filter(Boolean).join('');
  return combined ? combined.replace(/\\n/g, '\n') : undefined;
};

export const firebaseConfig = registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: getPrivateKey(),
}));
