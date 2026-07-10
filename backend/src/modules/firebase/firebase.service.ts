import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (getApps().length === 0) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  }

  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid Firebase Token');
    }
  }
}
