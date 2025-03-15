import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaPlus, FaTasks, FaCheck, FaCheckCircle, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

const ServiceRequestsSystem = () => {
  const [isFounder, setIsFounder] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [services, setServices] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState({
    teacherBaseRate: 11500,
    teacherBonusPerStudent: 1000,
    volumeDiscountPerHour: 500
  });
  
  // New request form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    serviceId: '',
    subject: '',
    studentName: '',
    hours: 1,
    date: '',
    notes: ''
  });
  
  // Instructor balance
  const [instructorBalance, setInstructorBalance] = useState(0);
  
  // Check user role
  useEffect(() => {
    checkUserRole();
  }, []);
  
  // Fetch data when user role is determined
  useEffect(() => {
    if (userId) {
      fetchServices();
      fetchInstructors();
      fetchRequests();
      if (userRole === 'instructor') {
        calculateInstructorBalance();
      }
    }
  }, [userId, userRole]);

  const checkUserRole = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
        
        // First try to find the document where the ID is the UID
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsFounder(userData.role === 'founder');
          setUserRole(userData.role);
        } else {
          // If no document exists with that ID, try to find one where uid == currentUser.uid
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', currentUser.uid))
          );
          
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setIsFounder(userData.role === 'founder');
            setUserRole(userData.role);
            setUserId(userDocs.docs[0].id); // Use the document ID instead of auth UID
          }
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchServices = async () => {
    try {
      // Get financial configuration
      const configDocRef = doc(db, 'configuration', 'financial');
      const configDoc = await getDoc(configDocRef);
      
      if (configDoc.exists()) {
        const config = configDoc.data();
        setConfigData({
          teacherBaseRate: config.teacherBaseRate || 11500,
          teacherBonusPerStudent: config.teacherBonusPerStudent || 1000,
          volumeDiscountPerHour: config.volumeDiscountPerHour || 500
        });
      }

      // Get all services
      const servicesCollection = collection(db, 'services');
      const snapshot = await getDocs(servicesCollection);
      
      if (!snapshot.empty) {
        const servicesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesList);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const instructorsQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['instructor', 'founder']),
        orderBy('displayName')
      );
      
      const snapshot = await getDocs(instructorsQuery);
      
      if (!snapshot.empty) {
        const instructorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInstructors(instructorsList);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let requestsQuery;
      
      if (isFounder) {
        // Founders see all requests
        requestsQuery = query(
          collection(db, 'serviceRequests'),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Instructors only see requests available to claim or assigned to them
        requestsQuery = query(
          collection(db, 'serviceRequests'),
          where('status', 'in', ['pending', 'assigned']),
          ...(userRole === 'instructor' ? [where('assignedTo', 'in', [null, userId])] : []),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(requestsQuery);
      
      if (!snapshot.empty) {
        const requestsList = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          
          // Get service details
          let serviceDetails = null;
          if (data.serviceId) {
            const serviceDocRef = doc(db, 'services', data.serviceId);
            const serviceDoc = await getDoc(serviceDocRef);
            if (serviceDoc.exists()) {
              serviceDetails = serviceDoc.data();
            }
          }
          
          // Get instructor details if assigned
          let instructorDetails = null;
          if (data.assignedTo) {
            const instructorDocRef = doc(db, 'users', data.assignedTo);
            const instructorDoc = await getDoc(instructorDocRef);
            if (instructorDoc.exists()) {
              instructorDetails = instructorDoc.data();
            }
          }
          
          return {
            id: doc.id,
            ...data,
            serviceDetails,
            instructorDetails,
            createdAt: data.createdAt?.toDate() || new Date()
          };
        }));
        
        setRequests(requestsList);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateInstructorBalance = async () => {
    try {
      // Get completed requests assigned to this instructor
      const completedRequestsQuery = query(
        collection(db, 'serviceRequests'),
        where('assignedTo', '==', userId),
        where('status', '==', 'completed')
      );
      
      const snapshot = await getDocs(completedRequestsQuery);
      
      if (!snapshot.empty) {
        let totalBalance = 0;
        
        await Promise.all(snapshot.docs.map(async doc => {
          const requestData = doc.data();
          
          if (requestData.serviceId && requestData.hours) {
            // Get service details
            const serviceDocRef = doc(db, 'services', requestData.serviceId);
            const serviceDoc = await getDoc(serviceDocRef);
            
            if (serviceDoc.exists()) {
              const serviceData = serviceDoc.data();
              
              // Calculate instructor payment
              const basePayment = configData.teacherBaseRate * requestData.hours;
              const studentsBonus = serviceData.students > 1 ? 
                (serviceData.students - 1) * configData.teacherBonusPerStudent * requestData.hours : 0;
              
              // Add to balance if not already paid
              if (!requestData.isPaid) {
                totalBalance += (basePayment + studentsBonus);
              }
            }
          }
        }));
        
        setInstructorBalance(totalBalance);
      }
    } catch (error) {
      console.error('Error calculating instructor balance:', error);
    }
  };

  const handleCreateRequest = async () => {
    try {
      // Validate form
      if (!newRequest.serviceId || !newRequest.subject || !newRequest.studentName || !newRequest.date) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
      }
      
      // Create new request
      const requestDocRef = await addDoc(collection(db, 'serviceRequests'), {
        serviceId: newRequest.serviceId,
        subject: newRequest.subject,
        studentName: newRequest.studentName,
        hours: Number(newRequest.hours),
        date: new Date(newRequest.date),
        notes: newRequest.notes,
        status: 'pending',
        assignedTo: null,
        createdBy: userId,
        createdAt: serverTimestamp(),
        isPaid: false
      });
      
      // Reset form
      setNewRequest({
        serviceId: '',
        subject: '',
        studentName: '',
        hours: 1,
        date: '',
        notes: ''
      });
      
      // Hide form
      setShowRequestForm(false);
      
      // Refresh requests
      fetchRequests();
      
      alert('Solicitud creada exitosamente.');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error al crear la solicitud.');
    }
  };

  const handleClaimRequest = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(requestDocRef, {
        status: 'assigned',
        assignedTo: userId,
        assignedAt: serverTimestamp()
      });
      
      fetchRequests();
    } catch (error) {
      console.error('Error claiming request:', error);
      alert('Error al asignar la solicitud.');
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'serviceRequests', requestId);
      
      await updateDoc(requestDocRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });
      
      fetchRequests();
      if (userRole === 'instructor') {
        calculateInstructorBalance();
      }
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Error al marcar como completada la solicitud.');
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getServiceById = (id) => {
    return services.find(service => service.id === id) || null;
  };

  const calculatePaymentForRequest = (request) => {
    if (!request.serviceDetails || !request.hours) return 0;
    
    const basePayment = configData.teacherBaseRate * request.hours;
    const studentsBonus = request.serviceDetails.students > 1 ? 
      (request.serviceDetails.students - 1) * configData.teacherBonusPerStudent * request.hours : 0;
    
    return basePayment + studentsBonus;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sistema de Solicitudes de Servicio</h2>
        {isFounder && (
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            {showRequestForm ? 'Cancelar' : <><FaPlus className="mr-2" /> Nueva Solicitud</>}
          </button>
        )}
      </div>

      {/* Balance para instructores */}
      {userRole === 'instructor' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tu Balance Actual</h3>
            <div className="text-xl font-bold text-green-600">{formatCurrency(instructorBalance)}</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Este es el monto acumulado por servicios completados pendientes de pago.
          </p>
        </div>
      )}

      {/* Formulario de nueva solicitud (solo para fundadores) */}
      {isFounder && showRequestForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Nueva Solicitud de Servicio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio *
              </label>
              <select
                value={newRequest.serviceId}
                onChange={(e) => setNewRequest({...newRequest, serviceId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Seleccione un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.students} alumno(s))
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materia/Asignatura *
              </label>
              <input
                type="text"
                value={newRequest.subject}
                onChange={(e) => setNewRequest({...newRequest, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Ej: Matemáticas, Física, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Estudiante *
              </label>
              <input
                type="text"
                value={newRequest.studentName}
                onChange={(e) => setNewRequest({...newRequest, studentName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nombre completo del estudiante"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Horas *
              </label>
              <input
                type="number"
                value={newRequest.hours}
                onChange={(e) => setNewRequest({...newRequest, hours: Math.max(1, parseInt(e.target.value) || 1)})}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la Clase *
              </label>
              <input
                type="date"
                value={newRequest.date}
                onChange={(e) => setNewRequest({...newRequest, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={newRequest.notes}
                onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Instrucciones especiales, temas a tratar, etc."
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowRequestForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-3"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateRequest}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Solicitud
            </button>
          </div>
        </div>
      )}

      {/* Lista de solicitudes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Solicitudes {userRole === 'instructor' ? 'Disponibles' : 'de Servicio'}</h3>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 text-lg">Cargando solicitudes...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-md">
            <FaTasks className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No hay solicitudes {userRole === 'instructor' ? 'disponibles' : ''} en este momento.</p>
            {isFounder && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear primera solicitud
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className={`border rounded-lg overflow-hidden ${
                  request.status === 'completed' ? 'border-green-200 bg-green-50' :
                  request.status === 'assigned' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'completed' ? 'Completada' :
                         request.status === 'assigned' ? 'Asignada' : 'Pendiente'}
                      </span>
                      <h4 className="text-lg font-medium text-gray-900">
                        {request.serviceDetails?.name || 'Servicio no disponible'}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center text-sm text-gray-700">
                        <FaUserCircle className="mr-1 text-gray-500" /> 
                        <span className="font-medium">Estudiante:</span> {request.studentName}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaTasks className="mr-1 text-gray-500" /> 
                        <span className="font-medium">Materia:</span> {request.subject}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaCalendarAlt className="mr-1 text-gray-500" /> 
                        <span className="font-medium">Fecha:</span> {formatDate(request.date)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="text-gray-700">
                        <span className="font-medium">Horas:</span> {request.hours}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Alumnos:</span> {request.serviceDetails?.students || '?'}
                      </div>
                      {request.assignedTo && (
                        <div className="text-gray-700">
                          <span className="font-medium">Instructor:</span> {request.instructorDetails?.displayName || 'No disponible'}
                        </div>
                      )}
                      <div className="text-gray-700">
                        <span className="font-medium">A cobrar:</span> {formatCurrency(calculatePaymentForRequest(request))}
                      </div>
                    </div>
                    
                    {request.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        "{request.notes}"
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
                    {/* Botones según estado y rol */}
                    {userRole === 'instructor' ? (
                      <>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleClaimRequest(request.id)}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Tomar solicitud
                          </button>
                        )}
                        {request.status === 'assigned' && request.assignedTo === userId && (
                          <button
                            onClick={() => handleCompleteRequest(request.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                          >
                            <FaCheck className="mr-1" /> Marcar completada
                          </button>
                        )}
                      </>
                    ) : isFounder && (
                      <>
                        {request.status === 'completed' && (
                          <div className="flex items-center text-green-600 font-medium">
                            <FaCheckCircle className="mr-1" /> Completada
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsSystem;

// Esquema de Firestore para la colección serviceRequests
/*
serviceRequests: {
  [id]: {
    serviceId: string, // ID del servicio solicitado
    subject: string, // Materia o asignatura
    studentName: string, // Nombre del estudiante
    hours: number, // Cantidad de horas
    date: timestamp, // Fecha de la clase
    notes: string, // Notas adicionales
    status: string, // 'pending', 'assigned', 'completed'
    assignedTo: string, // ID del instructor asignado (null si pendiente)
    createdBy: string, // ID del creador (generalmente founder)
    createdAt: timestamp, // Fecha de creación
    assignedAt: timestamp, // Fecha de asignación
    completedAt: timestamp, // Fecha de finalización
    isPaid: boolean // Indica si ya se pagó al instructor
  }
}
*/