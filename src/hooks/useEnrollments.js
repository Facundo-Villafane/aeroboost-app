import { useState, useEffect } from 'react';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from '../admin/AuthProvider';

export const useEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await enrollmentService.getStudentCourses(user.uid);
      
      if (result.success) {
        setEnrollments(result.enrollments);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId, paymentDetails = null) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' };
    
    try {
      const result = await enrollmentService.enrollStudent(user.uid, courseId, paymentDetails);
      
      if (result.success) {
        // Refrescar la lista de inscripciones
        await fetchEnrollments();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProgress = async (enrollmentId, progress, completedLessons = []) => {
    try {
      const result = await enrollmentService.updateProgress(enrollmentId, progress, completedLessons);
      
      if (result.success) {
        // Actualizar localmente
        setEnrollments(prev => prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { ...enrollment, progress, completedLessons }
            : enrollment
        ));
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isEnrolledInCourse = (courseId) => {
    return enrollments.some(enrollment => enrollment.courseId === courseId);
  };

  const getCourseEnrollment = (courseId) => {
    return enrollments.find(enrollment => enrollment.courseId === courseId);
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  return {
    enrollments,
    loading,
    error,
    enrollInCourse,
    updateProgress,
    isEnrolledInCourse,
    getCourseEnrollment,
    refetch: fetchEnrollments
  };
};