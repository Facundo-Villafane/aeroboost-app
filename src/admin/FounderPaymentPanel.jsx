import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs,
  addDoc, 
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaMoneyBillWave, FaUserCheck, FaHistory, FaCheckCircle } from 'react-icons/fa';

const FounderPaymentPanel = () => {
  const [isFounder, setIsFounder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paidPayments, setPaidPayments] = useState([]);
  const [instructorBalances, setInstructorBalances] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [configData, setConfigData] = useState({
    teacherBaseRate: 11500,
    teacherBonusPerStudent: 1000,
    volumeDiscountPerHour: 500
  });

  // Comprobar si el usuario tiene rol 'founder'
  useEffect(() => {
    checkFounderRole();
  }, []);

  // Cargar datos cuando se confirma que es fundador
  useEffect(() => {
    if (isFounder) {
      fetchConfigData();
      fetchCompletedRequests();
      fetchPaymentHistory();
    }
  }, [isFounder]);

  const checkFounderRole = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Primero intenta buscar el documento donde el ID es el UID del usuario
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsFounder(userData.role === 'founder');
        } else {
          // Si no existe un documento con ese ID, intenta buscar donde uid == currentUser.uid
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', currentUser.uid))
          );
          
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setIsFounder(userData.role === 'founder');
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar rol:', error);
    }
  };

  const fetchConfigData = async () => {
    try {
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
    } catch (error) {
      console.error('Error al obtener configuración:', error);
    }
  };

  const fetchCompletedRequests = async () => {
    setLoading(true);
    try {
      // Obtener todas las solicitudes completadas
      const requestsQuery = query(
        collection(db, 'serviceRequests'),
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );
      
      const snapshot = await getDocs(requestsQuery);
      
      if (!snapshot.empty) {
        const requestsList = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          
          // Obtener detalles del servicio
          let serviceDetails = null;
          if (data.serviceId) {
            const serviceDocRef = doc(db, 'services', data.serviceId);
            const serviceDoc = await getDoc(serviceDocRef);
            if (serviceDoc.exists()) {
              serviceDetails = serviceDoc.data();
            }
          }
          
          // Obtener detalles del instructor
          let instructorDetails = null;
          if (data.assignedTo) {
            const instructorDocRef = doc(db, 'users', data.assignedTo);
            const instructorDoc = await getDoc(instructorDocRef);
            if (instructorDoc.exists()) {
              instructorDetails = instructorDoc.data();
            }
          }
          
          // Calcular monto a pagar
          const payment = calculatePayment(data, serviceDetails);
          
          return {
            id: doc.id,
            ...data,
            serviceDetails,
            instructorDetails,
            payment,
            completedAt: data.completedAt?.toDate() || new Date()
          };
        }));
        
        setCompletedRequests(requestsList);
        
        // Separar en pagos pendientes y pagados
        const pending = requestsList.filter(request => !request.isPaid);
        const paid = requestsList.filter(request => request.isPaid);
        
        setPendingPayments(pending);
        setPaidPayments(paid);
        
        // Calcular balances por instructor
        const balances = {};
        pending.forEach(request => {
          if (request.assignedTo && request.instructorDetails) {
            if (!balances[request.assignedTo]) {
              balances[request.assignedTo] = {
                instructorId: request.assignedTo,
                instructorName: request.instructorDetails.displayName,
                instructorEmail: request.instructorDetails.email,
                amount: 0,
                requests: []
              };
            }
            
            balances[request.assignedTo].amount += request.payment;
            balances[request.assignedTo].requests.push(request);
          }
        });
        
        setInstructorBalances(balances);
      } else {
        setCompletedRequests([]);
        setPendingPayments([]);
        setPaidPayments([]);
        setInstructorBalances({});
      }
    } catch (error) {
      console.error('Error al cargar solicitudes completadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const paymentsQuery = query(
        collection(db, 'instructorPayments'),
        orderBy('paidAt', 'desc'),
        orderBy('amount', 'desc')
      );
      
      const snapshot = await getDocs(paymentsQuery);
      
      if (!snapshot.empty) {
        const paymentsList = await Promise.all(snapshot.docs.map(async doc => {
          const data = doc.data();
          
          // Obtener detalles del instructor
          let instructorDetails = null;
          if (data.instructorId) {
            const instructorDocRef = doc(db, 'users', data.instructorId);
            const instructorDoc = await getDoc(instructorDocRef);
            if (instructorDoc.exists()) {
              instructorDetails = instructorDoc.data();
            }
          }
          
          return {
            id: doc.id,
            ...data,
            instructorDetails,
            paidAt: data.paidAt?.toDate() || new Date()
          };
        }));
        
        setPaymentHistory(paymentsList);
      } else {
        setPaymentHistory([]);
      }
    } catch (error) {
      console.error('Error al cargar historial de pagos:', error);
    }
  };

  const calculatePayment = (request, serviceDetails) => {
    if (!serviceDetails || !request.hours) return 0;
    
    // Pago base por hora
    const basePayment = configData.teacherBaseRate * request.hours;
    
    // Bonificación por estudiantes adicionales
    const studentsBonus = serviceDetails.students > 1 ? 
      (serviceDetails.students - 1) * configData.teacherBonusPerStudent * request.hours : 0;
    
    // Pago total
    return basePayment + studentsBonus;
  };

  const handleMarkAsPaid = async (instructorId) => {
    if (!instructorBalances[instructorId]) return;
    
    const confirmPay = window.confirm(
      `¿Confirmar pago de ${formatCurrency(instructorBalances[instructorId].amount)} a ${instructorBalances[instructorId].instructorName}?`
    );
    
    if (!confirmPay) return;
    
    try {
      // 1. Actualizar cada solicitud como pagada
      for (const request of instructorBalances[instructorId].requests) {
        const requestDocRef = doc(db, 'serviceRequests', request.id);
        await updateDoc(requestDocRef, {
          isPaid: true,
          paidAt: new Date()
        });
      }
      
      // 2. Crear registro de pago
      const paymentData = {
        instructorId: instructorId,
        amount: instructorBalances[instructorId].amount,
        requestIds: instructorBalances[instructorId].requests.map(r => r.id),
        paidBy: auth.currentUser.uid,
        paidAt: new Date(),
        notes: `Pago de ${instructorBalances[instructorId].requests.length} servicios completados.`
      };
      
      await addDoc(collection(db, 'instructorPayments'), paymentData);
      
      // 3. Recargar datos
      fetchCompletedRequests();
      fetchPaymentHistory();
      
      alert(`Pago registrado correctamente para ${instructorBalances[instructorId].instructorName}.`);
    } catch (error) {
      console.error('Error al registrar pago:', error);
      alert('Error al registrar el pago. Por favor intente nuevamente.');
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
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Si el usuario no es fundador, mostrar mensaje de acceso denegado
  if (!isFounder) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceso Restringido</h2>
        <p className="text-gray-600 mb-6">Esta sección está disponible solo para administradores con rol de fundador.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Panel de Pagos a Instructores</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <FaHistory className="mr-2" /> {showHistory ? 'Ver Pagos Pendientes' : 'Ver Historial de Pagos'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500 text-lg">Cargando datos de pagos...</p>
        </div>
      ) : !showHistory ? (
        <>
          {/* Balances por Instructor */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Pagos Pendientes por Instructor</h3>
            
            {Object.keys(instructorBalances).length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-md">
                <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">No hay pagos pendientes a instructores en este momento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.values(instructorBalances).map((balance) => (
                  <div key={balance.instructorId} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <FaUserCheck className="mr-2 text-blue-500" />
                          {balance.instructorName}
                        </h4>
                        <p className="text-sm text-gray-600">{balance.instructorEmail}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center">
                        <div className="mr-4">
                          <span className="text-sm text-gray-600 block">Total a pagar:</span>
                          <span className="text-xl font-bold text-primary">{formatCurrency(balance.amount)}</span>
                        </div>
                        <button
                          onClick={() => handleMarkAsPaid(balance.instructorId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                        >
                          <FaMoneyBillWave className="mr-2" /> Marcar como Pagado
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Servicios pendientes de pago ({balance.requests.length}):</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {balance.requests.map((request) => (
                              <tr key={request.id}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{request.serviceDetails?.name || 'Servicio desconocido'}</div>
                                  <div className="text-xs text-gray-500">{request.subject}</div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {request.studentName}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(request.completedAt)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {request.hours}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatCurrency(request.payment)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Historial de Pagos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Historial de Pagos</h3>
            
            {paymentHistory.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-md">
                <FaHistory className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">No hay pagos registrados en el historial.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.instructorDetails?.displayName || 'Instructor desconocido'}</div>
                          <div className="text-xs text-gray-500">{payment.instructorDetails?.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.paidAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payment.requestIds?.length || 0} servicios
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {payment.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FounderPaymentPanel;