import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserMapping {
  id: string;
  googleEmail: string;
  googleUid: string;
  androidUid: string;
  createdAt: string;
  updatedAt: string;
}

class UserMappingService {
  private readonly COLLECTION_NAME = 'user_mappings';

  /**
   * Get the Android UID for a Google user
   */
  async getAndroidUidForGoogleUser(googleEmail: string, googleUid: string): Promise<string | null> {
    try {
      // First, try to find by email
      const emailQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('googleEmail', '==', googleEmail)
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        const mapping = emailSnapshot.docs[0].data() as UserMapping;
        return mapping.androidUid;
      }

      // If not found by email, try by Google UID
      const uidQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('googleUid', '==', googleUid)
      );
      const uidSnapshot = await getDocs(uidQuery);
      
      if (!uidSnapshot.empty) {
        const mapping = uidSnapshot.docs[0].data() as UserMapping;
        return mapping.androidUid;
      }

      return null;
    } catch (error) {
      console.error('Error getting Android UID for Google user:', error);
      return null;
    }
  }

  /**
   * Create a new user mapping
   */
  async createUserMapping(
    googleEmail: string, 
    googleUid: string, 
    androidUid: string
  ): Promise<boolean> {
    try {
      const mappingId = `mapping_${googleUid}`;
      const mapping: UserMapping = {
        id: mappingId,
        googleEmail,
        googleUid,
        androidUid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, this.COLLECTION_NAME, mappingId), mapping);
      return true;
    } catch (error) {
      console.error('Error creating user mapping:', error);
      return false;
    }
  }

  /**
   * Check if a mapping exists for a Google user
   */
  async hasMapping(googleEmail: string, googleUid: string): Promise<boolean> {
    const androidUid = await this.getAndroidUidForGoogleUser(googleEmail, googleUid);
    return androidUid !== null;
  }

  /**
   * Get all mappings (admin function)
   */
  async getAllMappings(): Promise<UserMapping[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      return snapshot.docs.map(doc => doc.data() as UserMapping);
    } catch (error) {
      console.error('Error getting all mappings:', error);
      return [];
    }
  }
}

export const userMappingService = new UserMappingService();
