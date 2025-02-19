import axios from 'axios';
import { Subject } from '../types';

const CLASS_SERVICE_URL = process.env.CLASS_SERVICE_URL || 'http://class-service:4002';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';

export const classServiceClient = axios.create({
  baseURL: CLASS_SERVICE_URL,
  timeout: 5000,
});

export const authServiceClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000,
});

export const getSubject = async (subjectId: string, authHeader: string): Promise<Subject | null> => {
  try {
    const { data } = await classServiceClient.get(`/subjects/${subjectId}`, {
      headers: { Authorization: authHeader },
    });

    return data;
  } catch (error) {
    console.error(`failed to fetch subject ${subjectId}:`, error);

    return null;
  }
};

export const verifyStudentEnrollment = async (studentId: string, subjectId: string, authHeader: string): Promise<boolean> => {
  try {
    const { data } = await classServiceClient.get(`/classes/enrollment/${studentId}/${subjectId}`, {
      headers: { Authorization: authHeader },
    });

    return data.isEnrolled;
  } catch (error) {
    console.error('Enrollment verification failed:', error);

    return false;
  }
};
