import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export const enrollmentService = {
  // Inscribir un estudiante en un curso
  async enrollStudent(studentId, courseId, paymentDetails = null) {
    try {
      const enrollmentData = {
        studentId,
        courseId,
        enrolledAt: serverTimestamp(),
        progress: 0,
        completedLessons: [],
        status: 'active',
        paymentDetails,
        lastAccessed: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
      return { success: true, enrollmentId: docRef.id };
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener cursos de un estudiante
  async getStudentCourses(studentId) {
    try {
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', studentId),
        where('status', '==', 'active')
      );

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollments = [];

      for (const enrollmentDoc of enrollmentsSnapshot.docs) {
        const enrollmentData = enrollmentDoc.data();
        
        // Obtener datos del curso
        const courseDoc = await getDoc(doc(db, 'courses', enrollmentData.courseId));
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          enrollments.push({
            id: enrollmentDoc.id,
            ...enrollmentData,
            course: {
              id: courseDoc.id,
              ...courseData
            }
          });
        }
      }

      return { success: true, enrollments };
    } catch (error) {
      console.error('Error al obtener cursos del estudiante:', error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar progreso de un estudiante en un curso
  async updateProgress(enrollmentId, progress, completedLessons = []) {
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        progress,
        completedLessons,
        lastAccessed: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      return { success: false, error: error.message };
    }
  },

  // Verificar si un estudiante está inscrito en un curso
  async isStudentEnrolled(studentId, courseId) {
    try {
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', studentId),
        where('courseId', '==', courseId),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(enrollmentsQuery);
      return { success: true, isEnrolled: !snapshot.empty };
    } catch (error) {
      console.error('Error al verificar inscripción:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estudiantes inscritos en un curso
  async getCourseStudents(courseId) {
    try {
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('courseId', '==', courseId),
        where('status', '==', 'active')
      );

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const students = [];

      for (const enrollmentDoc of enrollmentsSnapshot.docs) {
        const enrollmentData = enrollmentDoc.data();
        
        // Obtener datos del estudiante
        const studentDoc = await getDoc(doc(db, 'users', enrollmentData.studentId));
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          students.push({
            enrollmentId: enrollmentDoc.id,
            ...enrollmentData,
            student: {
              id: studentDoc.id,
              ...studentData
            }
          });
        }
      }

      return { success: true, students };
    } catch (error) {
      console.error('Error al obtener estudiantes del curso:', error);
      return { success: false, error: error.message };
    }
  },

  // Desactivar inscripción (no eliminar por historial)
  async deactivateEnrollment(enrollmentId) {
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        status: 'inactive',
        deactivatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error al desactivar inscripción:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas de inscripciones
  async getEnrollmentStats() {
    try {
      const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
      const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());

      const stats = {
        total: enrollments.length,
        active: enrollments.filter(e => e.status === 'active').length,
        completed: enrollments.filter(e => e.progress === 100).length,
        averageProgress: enrollments.length > 0 
          ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
          : 0
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { success: false, error: error.message };
    }
  }
};